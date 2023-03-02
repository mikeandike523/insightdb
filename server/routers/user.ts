import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { procedure, router } from '../trpc';

import { SerializableObject } from '@/types/SerializableObject';
import UserFacingError from '@/types/UserFacingError';
import { Connection, WrappedTx, type Procedure } from '@/utils/neo4j';
import normalizeEmail from '@/utils/normalizeEmail';

import { FormSchema as SigninFormSchema } from '@/pages/signin';
import { FormSchema as SignupFormSchema } from '@/pages/signup';

export const userRouter = router({
  create: procedure.input(SignupFormSchema).mutation(async ({ input, ctx }) => {
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
        throw new UserFacingError(
          new Error('A user already exists with the given email.')
        );
      }

      const createUserResult: Array<SerializableObject> = (await tx.run(
        `
          CREATE (user:PrincipalUser {
              email: $email,
              title: $title, 
              name: $name, 
              orgName: $orgName, 
              password: $password,
              uuid: apoc.create.uuid()
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

    await connection.withWriter(procedure);

    return 'User created successfully.';
  }),
  auth: procedure.input(SigninFormSchema).query(async ({ input, ctx }) => {
    const session = ctx.session;

    const email = input.email;
    const password = input.password;

    input.email = normalizeEmail(input.email);

    const connection = new Connection();

    const procedure: Procedure = async (tx: WrappedTx) => {
      const findUserResult: Array<SerializableObject> = (await tx.run(
        `
        MATCH (user:PrincipalUser {email: $email})
        RETURN
        user.email AS email,
        user.password AS password,
        user.title AS title,
        user.name AS name,
        user.orgname AS orgName
      
      `,
        {
          email: email
        }
      )) as Array<SerializableObject>;

      if (findUserResult.length === 0) {
        throw new UserFacingError(new Error('Invalid username or password.'));
      }

      if (findUserResult.length > 1) {
        throw new UserFacingError(
          new Error(
            'There was an error in our our systems. Please check back in 30 minutes.'
          )
        );
      }

      const user = findUserResult[0] as any;

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UserFacingError(new Error('Invalid username or password.'));
      }

      const claims = {
        email: user.email,
        title: user.title,
        name: user.name,
        orgName: user.orgName,
        uuid: user.uuid
      };

      return claims;
    };

    const claims = (await connection.withReader(procedure)) as any;

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set.');
    }

    const token = jwt.sign(
      claims as object,
      process.env.JWT_SECRET ?? 'BAD_SECRET'
    );

    session.user = {
      email: claims.email,
      title: claims.title,
      name: claims.name,
      orgName: claims.orgName,
      uuid: claims.uuid,
      token: token
    };

    return {
      email: claims.email,
      title: claims.title,
      name: claims.name,
      orgName: claims.orgName
    };
  })
});

export type UserRouter = typeof userRouter;
