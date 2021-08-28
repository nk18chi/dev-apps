import { ApolloServer, gql } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { schemaComposer } from 'graphql-compose';
import { userResolvers, UserTC } from 'graphql/user/UserResolvers';
import { userTypeDef } from 'graphql/user/UserTypeDef';
import connectDatabase from 'utils/database';

const initTypeDef = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

const typeDefs: any = [initTypeDef, userTypeDef];
let typeDef: string = '';
typeDefs.forEach((def: any) => (typeDef += def));
schemaComposer.addTypeDefs(typeDef);

const resolvers: any = {};
const apiResolvers = [userResolvers()];
apiResolvers.forEach((apiResolver: any) => {
  const keys = Object.keys(apiResolver);
  keys.forEach((key) => {
    resolvers[key] = resolvers[key]
      ? { ...resolvers[key], ...apiResolver[key] }
      : apiResolver[key];
  });
});
schemaComposer.addResolveMethods(resolvers);

schemaComposer.Query.addFields({
  userById: UserTC.getResolver('findById'),
  userMany: UserTC.getResolver('findMany'),
});

schemaComposer.Mutation.addFields({
  userCreateOne: UserTC.getResolver('createOne'),
  userUpdtateOne: UserTC.getResolver('updateOne'),
  userRemoveOne: UserTC.getResolver('removeOne'),
});

const schema = schemaComposer.buildSchema();

let db: any;
const apolloServer = new ApolloServer({
  schema,
  context: async () => {
    if (!db) {
      db = await connectDatabase();
    }
    return db;
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  // mocks: true
});
const startServer = apolloServer.start();
export default async function handler(req: any, res: any) {
  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
