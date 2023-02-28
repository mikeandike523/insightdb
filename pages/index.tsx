import {useRouter} from 'next/router'

import {
    Container,
    Typography,
    Box,
    Grid,
    Button,
    Stack,
    Paper
} from '@mui/material'

export default function Home(){

    let router = useRouter()

    return <Container maxWidth="lg" sx={{

    }} style={{height:"100vh"}}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }}>
                <Paper elevation={5} sx={{padding:"8px"}}>
                    <Stack direction="column" alignItems="center">
                        <Typography variant="h3" component="h1">
                            InsightDB
                        </Typography>
                        <Typography variant="body1">
                            Data Storage with Purpose
                        </Typography>
                        <Stack direction="row" justifyContent="center" alignItems="center">
                            <Button variant="text" onClick={()=>{
                                router.push('/signin')
                            }}>Sign In</Button>
                            <Button variant="text" onClick={()=>{
                                router.push('/signup')
                            }}>Sign Up</Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Box>

    </Container>    
}