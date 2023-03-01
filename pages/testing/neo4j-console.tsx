import { useState } from 'react';

import theme from '@/themes/default';

import {
  clientRead as n4j_read,
  clientWrite as n4j_write,
} from '@/utils/neo4j';

import { toSerializableObject } from '@/types/SerializableObject';

export default function Neo4JConsole() {
  if (process.env.NODE_ENV === 'production') {
    return <>Not available in production.</>;
  }

  const [query, setQuery] = useState('');

  const [response, setResponse] = useState('');

  const [paramsAsString, setParamsAsString] = useState('{}');

  const handleWrite = async () => {
    try {
      setResponse('');
      const result = await n4j_write(query, JSON.parse(paramsAsString));
      setResponse('Success:\n' + JSON.stringify(result, null, 2));
    } catch (e: unknown) {
      if (e instanceof Error) {
        setResponse(JSON.stringify(toSerializableObject(e), null, 2));
      }
    }
  };

  const handleRead = async () => {
    try {
      setResponse('');
      const result = await n4j_read(query, JSON.parse(paramsAsString));
      setResponse(JSON.stringify(result, null, 2));
    } catch (e: unknown) {
      if (e instanceof Error) {
        setResponse(
          'Error:\n' + JSON.stringify(toSerializableObject(e), null, 2),
        );
      }
    }
  };

  return (
    <>
      <h1>Neo4J Console</h1>
      <div>Query:</div>
      <textarea
        rows={20}
        cols={80}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      ></textarea>
      <div>Params:</div>
      <textarea
        defaultValue={paramsAsString}
        rows={20}
        cols={80}
        onChange={(e) => {
          setParamsAsString(e.target.value);
        }}
      ></textarea>
      <div>
        <button
          onClick={handleRead}
          style={{
            marginRight: theme.spacing.sm,
          }}
        >
          Read
        </button>
        <button onClick={handleWrite}>Write</button>
      </div>
      <textarea rows={20} cols={80} disabled value={response}></textarea>
    </>
  );
}
