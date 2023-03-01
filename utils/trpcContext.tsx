import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

import { getSession } from '@/utils/session';

export async function createContext(opts: CreateNextContextOptions) {
  const session = await getSession(opts.req, opts.res);

  return {
    session,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
