import { ApolloServer } from '@apollo/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { typeDefs } from '../../graphql/typeDefs';
import { resolvers } from '../../graphql/resolvers';
import { createGraphQLRequest, createHeaders, createSearch } from '../../libs/apollo-tools';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

apolloServer.start();

/**
 * Next.js用APIRouteハンドラ
 */
const apolloHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  //NextApiRequestをGraphQL用のbody形式に変換(multipart/form-data対応)
  const [body, removeFiles] = await createGraphQLRequest(req);
  try {
    const result = await apolloServer.executeHTTPGraphQLRequest({
      httpGraphQLRequest: {
        method: req.method ?? '',
        headers: createHeaders(req),
        search: createSearch(req),
        body,
      },
      context: async () => ({ req, res }),
    });
    if (result.body.kind === 'complete') {
      res.end(result.body.string);
    } else {
      for await (const chunk of result.body.asyncIterator) {
        res.write(chunk);
      }
      res.end();
    }
  } finally {
    // multipart/form-dataで作成された一時ファイルの削除
    removeFiles();
  }
};

export default apolloHandler;

export const config = {
  api: {
    bodyParser: false,
  },
};
