import { ReactNode, useState } from 'react';

import { useRouter } from 'next/router';

import { z } from 'zod';

import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';

import { useControlledInput } from '@/components/ControlledInput';

import { toSerializableObject } from '@/types/SerializableObject';
import UserFacingError from '@/types/UserFacingError';

import { trpc } from '@/utils/trpc';
import { TRPCClientError } from '@trpc/client';

const FormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Invalid Email Address' }),
  title: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required.' }),
  orgName: z.string().min(1, { message: 'Organization name is required.' }),
  password: z.string().min(1, { message: 'Password is required.' })
});

export { FormSchema };

export type FormValues = z.infer<typeof FormSchema>;

export default function Signup() {
  const router = useRouter();

  const [errorMessages, setErrorMessages] = useState<ReactNode[]>([]);

  const [success, setSuccess] = useState<boolean>(false);

  const [emailComponent, email, setEmailError] = useControlledInput(
    'Email Address',
    true,
    'email',
    '',
    { m: 1 }
  );

  const [titleComponent, title, setTitleError] = useControlledInput(
    'Title',
    false,
    'text',
    '',
    {
      m: 1
    }
  );

  const [nameComponent, name, setNameError] = useControlledInput(
    'Full Name',
    true,
    'text',
    '',
    { m: 1 }
  );

  const [orgNameComponent, orgName, setOrgNameError] = useControlledInput(
    'Organization Name',
    true,
    'text',
    '',
    { m: 1 }
  );

  const [passwordComponent, password, setPasswordError] = useControlledInput(
    'Password',
    true,
    'password',
    '',
    { m: 1 }
  );

  const zodErrorMapping: { [key: string]: (error: string) => void } = {
    email: setEmailError,
    title: setTitleError,
    name: setNameError,
    orgName: setOrgNameError,
    password: setPasswordError
  };

  const handleSubmit = async () => {
    try {
      setSuccess(false);

      setErrorMessages([]);

      for (const key in zodErrorMapping) {
        zodErrorMapping[key]('');
      }

      const parsed = FormSchema.parse({
        email,
        title,
        name,
        orgName,
        password
      });

      await trpc.user.create.mutate(parsed);

      setSuccess(true);
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        e.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const path = issue.path.join('.');
            if (path in zodErrorMapping) {
              zodErrorMapping[path](issue.message);
            }
          }
        });
      } else if (UserFacingError.is(e)) {
        setErrorMessages([UserFacingError.extract(e).message]);
      } else if (e instanceof TRPCClientError) {
        setErrorMessages([e.message, e.stack]);
      } else {
        if ('message' in e && 'stack' in e) {
          setErrorMessages([e.message, e.stack]);
        } else {
          setErrorMessages([JSON.stringify(toSerializableObject(e), null, 2)]);
        }
      }
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <AppBar position="relative">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              color="inherit"
              onClick={() => {
                router.push('/');
              }}
            >
              <Typography variant="h6" component="span">
                InsightDB
              </Typography>
            </Button>
          </Box>
          <Button
            color="inherit"
            onClick={() => {
              router.push('/signin');
            }}
          >
            Sign In
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              router.push('/signup');
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="md"
        sx={{
          height: '100%'
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Stack
            direction="column"
            alignItems="center"
            sx={{
              width: '100%'
            }}
          >
            <Typography variant="h2" component="h1">
              Sign Up
            </Typography>
            {emailComponent}
            {titleComponent}
            {nameComponent}
            {orgNameComponent}
            {passwordComponent}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
            {errorMessages.length > 0 && (
              <Alert sx={{ m: 1 }} severity="error">
                <>
                  {errorMessages.map((message, index) => {
                    return (
                      <div style={{ whiteSpace: 'pre-wrap' }} key={index}>
                        <Typography variant="body1">{message}</Typography>
                      </div>
                    );
                  })}
                </>
              </Alert>
            )}
            {success && (
              <Alert sx={{ m: 1 }} severity="success">
                <Typography variant="body1">
                  Signup Successful&nbsp;
                  <Button
                    variant="text"
                    onClick={() => {
                      router.push('/signin');
                    }}
                  >
                    Sign In
                  </Button>
                </Typography>
              </Alert>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
