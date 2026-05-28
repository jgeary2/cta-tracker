import {ApolloServer} from "apollo-server";
import {resolvers} from "./resolvers.ts";
import {readFileSync} from "node:fs";
import dotenv from "dotenv";

const typeDefs = readFileSync('./src/api/schema.graphql', { encoding: 'utf-8' });
const server = new ApolloServer({ typeDefs, resolvers });
dotenv.config({ path: '.env.local'});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
})
