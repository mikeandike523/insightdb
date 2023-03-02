// Some code taken from https://trpc.io/docs/v9/nextjs

import 'semantic-ui-css/semantic.min.css';

import { CookiesProvider } from 'react-cookie';

import Head from 'next/head';

import { AppType } from 'next/dist/shared/lib/utils';

import type { AppProps } from 'next/app';

import { GlobalStateProvider } from '@/utils/GlobalState';

import { CircularProgress } from '@mui/material';

const App: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <GlobalStateProvider
      defaultComponent={
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress />
        </div>
      }
    >
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </GlobalStateProvider>
  );
};

export default App;
