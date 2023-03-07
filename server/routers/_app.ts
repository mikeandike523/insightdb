// Adapted from https://trpc.io/docs/nextjs

import { router } from '../trpc';

import { userRouter } from './user';
import { userDataRouter } from './userdata';

export const appRouter = router({
  user: userRouter,
  userData: userDataRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
