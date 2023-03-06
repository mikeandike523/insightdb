import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { useGlobalState } from '@/utils/GlobalState';

export default function Signout() {
  const router = useRouter();
  const globalState = useGlobalState();
  useEffect(() => {
    globalState.update({
      user: null
    });
    router.push('/');
  }, []);
}
