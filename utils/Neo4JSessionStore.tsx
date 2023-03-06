import type { SessionStore } from 'next-session';
import { SessionData, SessionRecord } from 'next-session/lib/types';

import {
  SerializableObject,
  toSerializableObjectEnumerableOnly
} from '@/types/SerializableObject';
import { Connection, Procedure } from '@/utils/neo4j';

export default class Neo4JSessionStore implements SessionStore {
  async get(
    sid: string
  ): Promise<SessionData<SessionRecord> | null | undefined> {
    console.log(sid);
    const connection = new Connection();
    const procedure: Procedure = async (tx) => {
      const results = (await tx.run(
        `
        MATCH (s:Session {sid: $sid})
        RETURN s.stringified as stringified
      `,
        {
          sid: sid
        }
      )) as SerializableObject[];

      if (results.length === 0) {
        return null;
      }

      if (results.length > 1) {
        throw new Error(
          'There was a system error when retrieving session data'
        );
      }

      return results[0];
    };

    const sessEntry = (await connection.withWriter(
      procedure
    )) as SerializableObject;

    if (sessEntry === null) {
      return null;
    }

    return JSON.parse((sessEntry as { stringified: '{}' }).stringified);
  }
  async set(sid: string, sess: SessionData<SessionRecord>): Promise<void> {
    const connection = new Connection();
    const asString = JSON.stringify(toSerializableObjectEnumerableOnly(sess));
    console.log(asString);
    const procedure: Procedure = async (tx) => {
      await tx.run(
        `
        MERGE (s:Session {sid: $sid, stringified: $stringified})
        RETURN s
      `,
        {
          sid: sid,
          stringified: asString
        }
      );

      return null;
    };
    await connection.withWriter(procedure);
  }
  async destroy(sid: string): Promise<void> {
    const connection = new Connection();
    const procedure: Procedure = async (tx) => {
      await tx.run(
        `
        MATCH (s:Session {sid: $sid})
        DELETE s
      `,
        {
          sid: sid
        }
      );

      return null;
    };
    await connection.withWriter(procedure);
  }
  async touch?(sid: string, sess: SessionData<SessionRecord>): Promise<void> {
    const connection = new Connection();
    const asString = JSON.stringify(toSerializableObjectEnumerableOnly(sess));
    console.log(asString);
    const procedure: Procedure = async (tx) => {
      await tx.run(
        `
        MERGE (s:Session {sid: $sid, stringified: $stringified})
        RETURN s
      `,
        {
          sid: sid,
          stringified: asString
        }
      );

      return null;
    };
    await connection.withWriter(procedure);
  }
}
