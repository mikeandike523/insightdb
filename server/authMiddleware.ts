import jwt from 'jsonwebtoken';

import { middleware } from '@/server/trpc';

import { UnauthorizedError, UserFacingError } from '@/types/UserFacingError';

import {
  KeyError,
  recordSubset,
  SerializableRecord,
  serializableRecordStrictlyMatches,
  TreeAccess
} from '@/types/SerializableObject';

import { getEnvStrict } from '@/utils/tsutils';

export const authMiddleware = middleware(async ({ ctx, next }) => {
  const session = ctx.session;
  if (!session.user) {
    throw new UserFacingError(
      new UnauthorizedError('Missing value for `user` in session.')
    );
  }
  let user: SerializableRecord = session.user as SerializableRecord;
  if (!user.token) {
    throw new UserFacingError(
      new UnauthorizedError('Missing value for `token` in session.user.')
    );
  }

  try {
    const token = TreeAccess(user).getStrict(['token']) as string;
    let claims = jwt.verify(
      token,
      getEnvStrict('JWT_SECRET')
    ) as SerializableRecord;
    claims = recordSubset(claims, [
      'uuid',
      'name',
      'email',
      'title',
      'orgName'
    ]);
    user = recordSubset(user, ['uuid', 'name', 'email', 'title', 'orgName']);
    if (!serializableRecordStrictlyMatches(claims, user)) {
      throw new UserFacingError(
        new UnauthorizedError('JWT claims mismatch data in session.user.')
      );
    }
    const groundTruthUUID = user.uuid as string;
    const claimUUID = claims.uuid as string;
    if (groundTruthUUID !== claimUUID) {
      throw new UserFacingError(
        new UnauthorizedError(
          `Mismatch between JWT and session user UUID. Likely a system error.`
        )
      );
    }
  } catch (e: unknown) {
    if (e instanceof jwt.JsonWebTokenError) {
      throw new UserFacingError(new UnauthorizedError('Invalid jwt token.'));
    } else if (e instanceof KeyError) {
      throw new UserFacingError(e, 401);
    }
    throw e;
  }

  return next({
    ctx: {
      user: user
    }
  });
});
