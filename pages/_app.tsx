// Some code taken from https://trpc.io/docs/v9/nextjs

import { AppType } from 'next/dist/shared/lib/utils';
import {trpc} from '@/utils/trpc'

import type { AppProps } from 'next/app'

import '@/framework/framework.css'

import { GlobalStateProvider } from '@/utils/GlobalState'

const App: AppType = ({ Component, pageProps }: AppProps) =>{
  return <GlobalStateProvider defaultComponent={
    <h1>Loading...</h1>
  }>
    <Component {...pageProps} />
  </GlobalStateProvider>
}

export default trpc.withTRPC(App);
