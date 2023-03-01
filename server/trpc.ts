// Copied from https://trpc.io/docs/nextjs

import { initTRPC } from '@trpc/server';

import type { Context } from '@/utils/trpcContext';

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in in libraries.
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    if (error.cause) {
      return {
        ...shape,
        data: {
          ...shape.data,
          cause: error.cause
        }
      };
    }
    return {
      ...shape,
      data: {
        ...shape.data
      }
    };
  }
});

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
