import { useRouter } from 'next/router';

import { Button, Divider } from '@mui/material';

import { SerializableObject, unroll } from '@/types/SerializableObject';

export default function Unroll() {
  const router = useRouter();

  const obj: SerializableObject = {
    a: 2,
    b: {
      c: 3,
      d: 4
    },
    e: 5,
    f: {
      g: {
        a: 2,
        bc: 3
      },
      h: {
        c: 3,
        d: 4
      }
    }
  };

  return (
    <>
      <Button onClick={() => router.push('/')}>Home</Button>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(obj, null, 2)}
      </div>
      <Divider />
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(unroll(obj), null, 2)}
      </div>
    </>
  );
}
