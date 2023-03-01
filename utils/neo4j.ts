// Adapted from https://dev.to/adamcowley/using-neo4j-in-your-next-nextjs-project-77

import neo4j, { Driver, ManagedTransaction } from 'neo4j-driver';
import axios from 'axios';

import {
  SerializableObject,
  toSerializableObject,
} from '@/types/SerializableObject';

let _conn: Driver | null;

export function getConn(): Driver {
  if (_conn) {
    return _conn as Driver;
  } else {
    if (!process.env.NEO4J_URI) {
      throw new Error(
        'NEO4J_URI is not set. Note: getConn() is server-side only.',
      );
    } else {
      _conn = neo4j.driver(
        process.env.NEO4J_URI,
        neo4j.auth.basic(
          process.env.NEO4J_USERNAME ?? '',
          process.env.NEO4J_PASSWORD ?? '',
        ),
      );
      return _conn as Driver;
    }
  }
}

export async function read(
  cypher: string,
  params = {},
): Promise<SerializableObject> {
  // 1. Open a session
  const session = getConn().session();

  try {
    // 2. Execute a Cypher Statement
    const res = await session.executeRead((tx) => tx.run(cypher, params));

    // 3. Process the Results
    const values = res.records.map((record) => record.toObject());

    return toSerializableObject(values) as SerializableObject;
  } finally {
    // 4. Close the session
    await session.close();
  }
}

export async function write(
  cypher: string,
  params = {},
): Promise<SerializableObject> {
  // 1. Open a session
  const session = getConn().session();

  try {
    // 2. Execute a Cypher Statement
    const res = await session.executeWrite((tx) => tx.run(cypher, params));

    // 3. Process the Results
    const values = res.records.map((record) => record.toObject());

    return toSerializableObject(values) as SerializableObject;
  } finally {
    // 4. Close the session
    await session.close();
  }
}

export function responseToObject(res: any): object {
  return res.records.map((record: any) => record.toObject());
}

export function responseToSerializableObject(res: any): SerializableObject {
  return toSerializableObject(responseToObject(res));
}

export async function clientRead(
  cypher: string,
  params = {},
): Promise<SerializableObject> {
  const data = (
    await axios.post('/api/testing/neo4j-console', {
      queryType: 'read',
      query: cypher,
      params: params,
    })
  ).data;
  return toSerializableObject(data) as SerializableObject;
}

export async function clientWrite(
  cypher: string,
  params = {},
): Promise<SerializableObject> {
  const data = (
    await axios.post('/api/testing/neo4j-console', {
      queryType: 'write',
      query: cypher,
      params: params,
    })
  ).data;
  return toSerializableObject(data) as SerializableObject;
}

export type Procedure = (tx: WrappedTx) => Promise<any>;

export class WrappedTx {
  tx: ManagedTransaction;
  constructor(tx: ManagedTransaction) {
    this.tx = tx;
  }
  async run(query: string, params: SerializableObject) {
    return responseToSerializableObject(await this.tx.run(query, params));
  }
}

export class Connection {
  conn: Driver;
  constructor() {
    this.conn = getConn();
  }
  async withTransaction(
    mode: 'write' | 'read',
    procedure: Procedure,
  ): Promise<SerializableObject | void> {
    const session = this.conn.session();
    try {
      const transaction =
        mode === 'write'
          ? session.executeWrite(async (tx) => {
              const result = await procedure(new WrappedTx(tx));
              return result;
            })
          : session.executeRead(async (tx) => {
              return await procedure(new WrappedTx(tx));
            });

      const result = await transaction;

      return result as SerializableObject;
    } finally {
      await session.close();
    }
  }
  async withWriter(procedure: Procedure) {
    return await this.withTransaction('write', procedure);
  }
  async withReader(procedure: Procedure) {
    return await this.withTransaction('read', procedure);
  }
}
