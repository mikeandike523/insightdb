// Copied from https://trpc.io/docs/nextjs

import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/routers/_app';

import { createContext } from '@/utils/trpcContext';

// export API handler
// @see https://trpc.io/docs/api-handler
const AppRouter = trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});

export type AppRouter = typeof AppRouter;

export default AppRouter;
