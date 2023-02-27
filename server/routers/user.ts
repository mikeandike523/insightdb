import { z } from 'zod'
import bcrypt from 'bcryptjs'


import { procedure, router } from '../trpc'

import {Connection, WrappedTx, type Procedure} from '@/utils/neo4j'
import { SerializableObject } from '@/types/SerializableObject'
import normalizeEmail from '@/utils/normalizeEmail'

export const userRouter = router({
    create: procedure.input(z.object({
        email:z.string().min(1).email(),
        name:z.string().min(1),
        organization:z.string().min(1),
        password:z.string().min(1)
    })).mutation(async ({input})=>{

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
                throw new Error('A user already exists with the given email.')
            }

            let createUserResult: Array<SerializableObject> = await tx.run(`
                CREATE (user:PrincipalUser {
                    email: $email, 
                    name: $name, 
                    organization: $organization, 
                    password: $password
                })
                RETURN user
            `, {
                email: input.email,
                name: input.name,
                organization: input.organization,
                password: passwordHash
            }) as Array<SerializableObject>

            return createUserResult

        }

        let result: Array<SerializableObject> = await connection.withWriter(procedure) as Array<SerializableObject>

        console.log(result)

        return result

    })
})

export type UserRouter = typeof userRouter
