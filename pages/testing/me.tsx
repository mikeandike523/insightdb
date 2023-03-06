import {
  SerializableObject,
  toSerializableObject
} from '@/types/SerializableObject';
import { trpc } from '@/utils/trpc';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Me() {
  const router = useRouter();

  const [response, setResponse] = useState<SerializableObject>({});

  useEffect(() => {
    (async () => {
      try {
        const response = await trpc.user.me.query();
        setResponse(response);
      } catch (e) {
        setResponse(toSerializableObject(e));
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
    </>
  );
}
