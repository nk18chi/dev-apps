import { composeWithMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';
const { User } = require('models/User');

const userResolvers = () => ({
  Query: {
    user: async (_: any, { name }: any) => {
      // you can add some operations
      return 'query user ' + name;
    },
  },
  Mutation: {
    createUser: async (_: any, { name }: any) => {
      // you can add some operations
      return 'create user ' + name;
    },
  },
});

const UserTC = schemaComposer.has('UserTC')
  ? schemaComposer.getOTC('UserTC')
  : composeWithMongoose(User, { name: 'UserTC' });
UserTC.wrapResolverResolve('updateOne', (next) => async (rp) => {
  rp.beforeRecordMutate = async (doc: any, resolveParams: any) => {
    // you can add some operations
    return doc;
  };
  return next(rp);
});

export { UserTC, userResolvers };
