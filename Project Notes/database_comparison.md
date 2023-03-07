There seems to be two appropriate database technologies for designing a flexible Schema/Constraint system

1. Use Mongoose with nested objects
2. With Mongoose with parallel objects
3. Use neo4j with manually sanitized keys
4. Use Neo4j with parallel objects

#1 Is the most direct option but it will be extremely slow if ened to manually perform search and aggregation operations 
#2 and #4 should be generally equivalent, and its a matter of the speed and flexibility of mongoose versus neo4j. Broadly, neo4j is more flexible whereas mongodb MAY perform better at scale. Either way, for scale cassandra might even be better
#3 Seems pretty janky and unnecessary. Although constraints can be made natively, this just means operations will throw errors which will need to be carefully caught and handled

**Either way, if not satistified with neo4j, it is important to research all other relevant NoSQL database options (apache cassandra, etc.) before redoing existing work in MongoDB**

