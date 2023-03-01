import type { NextApiRequest, NextApiResponse } from 'next';

import { toSerializableObject } from '@/types/SerializableObject';
import { read as n4j_read, write as n4j_write } from '@/utils/neo4j';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Not available in production.');
    }

    const queryType = req.body.queryType ?? 'read';
    const query = req.body.query ?? '';
    const params = req.body.params ?? {};
    const func = queryType === 'read' ? n4j_read : n4j_write;
    const result = await func(query, params);
    res.status(200).json(result);
  } catch (e: unknown) {
    res.status(500).json(toSerializableObject(e));
  }
}
