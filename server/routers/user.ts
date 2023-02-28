import { z } from 'zod'
import bcrypt from 'bcryptjs'


import { procedure, router } from '../trpc'

import {Connection, WrappedTx, type Procedure} from '@/utils/neo4j'
import { SerializableObject, toSerializableObject } from '@/types/SerializableObject'
import normalizeEmail from '@/utils/normalizeEmail'
import UserFacingError from '@/types/UserFacingError'


import { FormSchema } from '@/pages/signup'

export const userRouter = router({
    create: procedure.input(FormSchema).mutation(async ({input})=>{
        
        let SALT_LENGTH = process.env.SALT_LENGTH ? parseInt(process.env.SALT_LENGTH, 10) : 12

        let passwordHash = bcrypt.hashSync(input.password, SALT_LENGTH)

        input.email = normalizeEmail(input.email)

        let connection = new Connection()

        let procedure: Procedure = async (tx: WrappedTx) => {

            let findUsersResult: Array<SerializableObject> = await tx.run(
            `
                MATCH (user:PrincipalUser {email: $email})
                RETURN user
            `,
            {
                email: input.email
            }) as Array<SerializableObject>

            if(findUsersResult.length > 0){
                return new UserFacingError('A user already exists with the given email.')
            }

            let createUserResult: Array<SerializableObject> = await tx.run(`
                CREATE (user:PrincipalUser {
                    email: $email,
                    title: $title, 
                    name: $name, 
                    orgName: $orgName, 
                    password: $password
                })
                RETURN user
            `, {
                email: input.email,
                title: input.title ?? null,
                name: input.name,
                orgName: input.orgName,
                password: passwordHash
            }) as Array<SerializableObject>

            return createUserResult

        }

        let result: Array<SerializableObject> | UserFacingError = await connection.withWriter(procedure) as Array<SerializableObject> | UserFacingError

        return toSerializableObject(result)

    })
})

export type UserRouter = typeof userRouter
