import { useRouter } from 'next/router';

import { Button, Link, Stack, Typography } from '@mui/material';

import { useGlobalState } from '@/utils/GlobalState';

export default function Home() {
  const router = useRouter();

  const globalState = useGlobalState();

  if (globalState.get().user) {
    router.push('/dashboard');
  }

  return !globalState.get().user ? (
    <div style={{ height: '100vh', width: '100vw' }}>
      {process.env.NODE_ENV === 'development' && (
        <Link
          style={{
            position: 'absolute'
          }}
          href="/testing/neo4j-console"
        >
          Neo4J Console
        </Link>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}
      >
        <Stack direction="column" alignItems="center">
          <Typography variant="h3" component="h1">
            InsightDB
          </Typography>
          <Typography variant="body1">Data Storage with Purpose</Typography>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Button
              variant="text"
              onClick={() => {
                router.push('/signin');
              }}
            >
              Sign In
            </Button>
            <Button
              variant="text"
              onClick={() => {
                router.push('/signup');
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Stack>
      </div>
    </div>
  ) : (
    <></>
  );
}
