import type { AppProps } from 'next/app';
import { Suspense } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { SSRCache, SSRProvider } from '../libs/apollo-ssr';

const endpoint = '/api/graphql';

const App = ({ Component, pageProps }: AppProps) => {
  const client = new ApolloClient({
    uri:
      typeof window === 'undefined'
        ? `${
            process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
          }${endpoint}`
        : endpoint,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client} suspenseCache={new SSRCache()}>
      <SSRProvider>
        <Suspense fallback={'Loading'}>
          <Component {...pageProps} />
        </Suspense>
      </SSRProvider>
    </ApolloProvider>
  );
};

// getInitialProps自体は必要としていないが、_app.tsxの最適化防止のために必要
// これを入れないとbuild時に実行されて、それ以降呼び出されなくなる
App.getInitialProps = () => ({ pageProps: {} });

export default App;
