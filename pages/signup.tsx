import {useState} from 'react'
import {z} from 'zod'

import Page from '@/framework/Page'
import Billboard from '@/framework/Billboard'

import useControlledInput from '@/framework/ControlledInput'

import {trpc} from '@/utils/trpc'
import { toSerializableObject } from '@/types/SerializableObject'

let FormSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    organization: z.string().min(1),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
}).strict().superRefine(({
    password, 
    confirmPassword
}, ctx)=>{
    if(password !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            path: ['confirmPassword'],
            message:"Password and confirm password don't match"
        })
    }
})

declare type FormValueType = z.infer<typeof FormSchema>

export default function Signup(){
    
    let [emailComponent, email] = useControlledInput({
        type: 'email',
        label: 'Email',
    })

    let [nameComponent, name] = useControlledInput({
        type: 'text',
        label: 'Full Name'
    })

    let [organizationComponent, organization] = useControlledInput({
        type: 'text',
        label: 'Organization'
    })

    let [passwordComponent, password] = useControlledInput({
        type: 'password',
        label: 'Password'
    })

    let [confirmPasswordComponent, confirmPassword] = useControlledInput({
        type: 'password',
        label: 'Confirm Password'
    })

    let [errorMessage, setErrorMessage] = useState("")

    let [successMessage, setSuccessMessage] = useState("")

    // mutations
    let createUserMutation = trpc.user.create.useMutation()

    const handleSubmit = async ()=>{
        setErrorMessage("")
        setSuccessMessage("")
        try{
            let response = await createUserMutation.mutateAsync({
                email: email,
                password: password,
                name: name,
                organization: organization
            })
            console.log(response)
            setSuccessMessage(JSON.stringify(toSerializableObject(response), null, 2))
        }catch(e: unknown){
            setErrorMessage(JSON.stringify(toSerializableObject(e),null,2))
        }
    }
    
    return <Page style={{overflow:"auto"}}> 
       {/* <Billboard style={{overflow:"auto"}}> */}
            <h1>Signup</h1>
            <div>
                {emailComponent}
                {nameComponent}
                {organizationComponent}
                {passwordComponent}
                {confirmPasswordComponent}
                <div style={{
                    background: 'red',
                    color: 'black',
                    whiteSpace: 'pre-line'
                }}>
                    {errorMessage}
                </div>
                <div style={{
                    background: 'green',
                    color: 'black',
                    whiteSpace: 'pre-line'
                }}>
                    {successMessage}
                </div>
                <button type="button" onClick={handleSubmit}>Submit</button>
            </div>
        {/* </Billboard> */}
    </Page>
}