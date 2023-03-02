import { useRouter } from 'next/router';

import { Box, Button, Link, Stack, Typography } from '@mui/material';

export default function Home() {
  const router = useRouter();

  return (
    <Box sx={{}} style={{ height: '100%', width: '100%' }}>
      {process.env.NODE_ENV === 'development' && (
        <Link href="/testing/neo4j-console">Neo4J Console</Link>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
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
      </Box>
    </Box>
  );
}
