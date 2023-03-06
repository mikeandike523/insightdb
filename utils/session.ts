import nextSession from 'next-session';

import Neo4JSessionStore from './Neo4JSessionStore';

const store = new Neo4JSessionStore();

const getSession = nextSession({
  store: store
});

export { getSession };
