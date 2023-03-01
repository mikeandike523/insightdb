import bcrypt from 'bcryptjs';

import { procedure, router } from '../trpc';

import {
  SerializableObject,
  toSerializableObject
} from '@/types/SerializableObject';
import UserFacingError from '@/types/UserFacingError';
import { Connection, WrappedTx, type Procedure } from '@/utils/neo4j';
import normalizeEmail from '@/utils/normalizeEmail';

import { FormSchema } from '@/pages/signup';

export const userRouter = router({
  create: procedure
    .input(FormSchema)

    //           example of the use of middleware
    // .use(
    //   middleware(async ({ ctx, next }) => {
    //     return next({
    //       ctx: {
    //         // Specify additional fields to add to ctx object. Original fields
    //         // As defined in the Context type in trpcContext.tsx are still present
    //       }
    //     });
    //   })
    // )

    .mutation(async ({ input, ctx }) => {
      const SALT_LENGTH = process.env.SALT_LENGTH
        ? parseInt(process.env.SALT_LENGTH, 10)
        : 12;

      const passwordHash = bcrypt.hashSync(input.password, SALT_LENGTH);

      input.email = normalizeEmail(input.email);

      const connection = new Connection();

      const procedure: Procedure = async (tx: WrappedTx) => {
        const findUsersResult: Array<SerializableObject> = (await tx.run(
          `
                MATCH (user:PrincipalUser {email: $email})
                RETURN user
            `,
          {
            email: input.email
          }
        )) as Array<SerializableObject>;

        if (findUsersResult.length > 0) {
          return new UserFacingError(
            'A user already exists with the given email.'
          );
        }

        const createUserResult: Array<SerializableObject> = (await tx.run(
          `
                CREATE (user:PrincipalUser {
                    email: $email,
                    title: $title, 
                    name: $name, 
                    orgName: $orgName, 
                    password: $password
                })
                RETURN user
            `,
          {
            email: input.email,
            title: input.title ?? null,
            name: input.name,
            orgName: input.orgName,
            password: passwordHash
          }
        )) as Array<SerializableObject>;

        return createUserResult;
      };

      const result: Array<SerializableObject> | UserFacingError =
        (await connection.withWriter(procedure)) as
          | Array<SerializableObject>
          | UserFacingError;

      return toSerializableObject(result);
    })
});

export type UserRouter = typeof userRouter;
