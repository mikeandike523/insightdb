import {
  SerializableObject,
  toSerializableObject
} from '@/types/SerializableObject';
import { trpc } from '@/utils/trpc';
import { Button, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Me() {
  const router = useRouter();

  const [response, setResponse] = useState<SerializableObject>({});

  const [protectedResponse, setProtectedResponse] =
    useState<SerializableObject>({});

  useEffect(() => {
    (async () => {
      try {
        setResponse(await trpc.user.me.query());
      } catch (e) {
        setResponse(toSerializableObject(e));
      }
      try {
        setProtectedResponse(await trpc.userData.me.query());
      } catch (e) {
        setProtectedResponse(toSerializableObject(e));
      }
    })();
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return <>Not available outside development</>;
  }

  return (
    <>
      <Button
        onClick={() => {
          router.push('/');
        }}
      >
        Home
      </Button>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(response, null, 2)}
      </div>
      <Divider />
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(protectedResponse, null, 2)}
      </div>
    </>
  );
}
