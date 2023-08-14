import { ApolloServer } from '@apollo/server';
import type { NextApiHandler } from 'next';
import { typeDefs } from '../../graphql/typeDefs';
import { resolvers } from '../../graphql/resolvers';
import { executeHTTPGraphQLRequest } from '@react-libraries/next-apollo-server';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

apolloServer.start();

/**
 * Next.js用APIRouteハンドラ
 */
const apolloHandler: NextApiHandler = async (req, res) => {
  await executeHTTPGraphQLRequest({
    req,
    res,
    apolloServer: await apolloServer,
    context: async () => {
      return { req, res };
    },
  });
};

export default apolloHandler;

export const config = {
  api: {
    bodyParser: false,
  },
};
