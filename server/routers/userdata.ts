import { procedure, router } from '../trpc';

import { authMiddleware } from '../authMiddleware';

export const userDataRouter = router({
  me: procedure.use(authMiddleware).query(({ ctx }) => {
    return ctx.user;
  })
});

export type UserDataouter = typeof userDataRouter;
