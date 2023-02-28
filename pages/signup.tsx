import {useState, ReactNode} from 'react'

import {useRouter} from 'next/router'

import {z} from 'zod'

import {
    Container,
    AppBar,
    Box,
    Typography,
    Toolbar,
    Button,
    Stack,
    Alert
} from '@mui/material'

import { useControlledInput } from '@/components/ControlledInput'

import { toSerializableObject } from '@/types/SerializableObject'
import UserFacingError from '@/types/UserFacingError'

import {trpc} from '@/utils/trpc'
import { TRPCClientError } from '@trpc/client'

let FormSchema = z.object({
    email: z.string().min(1).email(),
    title: z.string().min(1).optional(),
    name: z.string().min(1),
    orgName: z.string().min(1),
    password: z.string().min(1)
})

export {FormSchema}

export type FormValues =  z.infer<typeof FormSchema> 

export default function Signup(){

    let createUserMutation = trpc.user.create.useMutation()

    let router = useRouter()

    let [errorMessages, setErrorMessages] = useState<ReactNode[]>([])

    let [success, setSuccess] = useState<boolean>(false)

    let [emailComponent, email] = useControlledInput("Email Address", true,"email","",{m:1})

    let [titleComponent, title] = useControlledInput("Title", false,"text","",{m:1})

    let [nameComponent, name] = useControlledInput("Full Name", true,"text","",{m:1})

    let [orgNameComponent, orgName] = useControlledInput("Organization Name", true,"text","",{m:1})

    let [passwordComponent, password] = useControlledInput("Password", true, "password","",{m:1})

    const handleSubmit = async ()=>{
        try{

            setSuccess(false)
            
            setErrorMessages([])

            const parsed = FormSchema.parse({
                email,
                title,
                name,
                orgName,
                password
            })

            let response = await createUserMutation.mutateAsync(parsed)

            if(UserFacingError.is(response))
            {
                throw response
            }

            setSuccess(true)

        }catch(e: any){
            if(e instanceof z.ZodError){
                setErrorMessages(e.issues.map((issue)=>{
                    if(issue.path.length>0){
                        return <span><b>{issue.path[0]}:</b>&nbsp;{issue.message}</span>
                    }else{
                        return ""
                    }
                }))
            }else if(UserFacingError.is(e)){
                setErrorMessages([
                    e.message
                ])   
            }
            else if(e instanceof TRPCClientError){
                setErrorMessages([
                    e.message,
                    e.stack
                ])
            }
            else{
                if("message" in e && "stack" in e){
                    setErrorMessages([
                        e.message,
                        e.stack
                    ])
                }else{
                    setErrorMessages([
                        JSON.stringify(toSerializableObject(e),null,2)
                    ])
                }
            }
        }
    }


    return <Box sx={{
        height: '100vh',
        width:"100%"
    }}> 
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Button color="inherit" onClick={()=>{router.push("/")}}>
                        <Typography variant="h6" component="span">
                            InsightDB
                        </Typography>
                    </Button>
                </Box>
                <Button color="inherit" onClick={()=>{router.push("/signin")}}>Sign In</Button>
                <Button color="inherit" onClick={()=>{router.push("/signup")}}>Sign Up</Button>
            </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{
            height: '100vh'
        }}>
            <Box sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Stack direction="column" alignItems="center">
                    <Typography variant="h4" component="h1">
                        Sign Up
                    </Typography>
                    {emailComponent}
                    {titleComponent}
                    {nameComponent}
                    {orgNameComponent}
                    {passwordComponent}
                    <Button variant='contained' color="primary" onClick={handleSubmit}>Submit</Button>
                    {
                        (errorMessages.length>0)&&(
                            <Alert severity="error">
                                <ul>
                                    {
                                        errorMessages.map((message,index)=>{
                                            return <li key={index}>{message}</li>
                                        })
                                    }
                                </ul>
                            </Alert>
                        )
                    }
                    {
                        success&&(
                            <Alert severity="success">
                                Signup Successful&nbsp;<Button
                                    variant="text"
                                    onClick={()=>{
                                        router.push("/signin")
                                    }}
                                >Sign In</Button>
                            </Alert>
                        )
                    }
                </Stack>
            </Box>
        </Container>
    </Box>
}