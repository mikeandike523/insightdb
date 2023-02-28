// Some code taken from https://trpc.io/docs/v9/nextjs

import 'semantic-ui-css/semantic.min.css'

import Head from 'next/head'

import { AppType } from 'next/dist/shared/lib/utils';
import {trpc} from '@/utils/trpc'

import type { AppProps } from 'next/app'

import { GlobalStateProvider } from '@/utils/GlobalState'

const App: AppType = ({ Component, pageProps }: AppProps) =>{
  return <GlobalStateProvider defaultComponent={
    <>Loading...</>
  }>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Component {...pageProps} />
  </GlobalStateProvider>
}

export default trpc.withTRPC(App);
