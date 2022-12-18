import type { AppProps } from 'next/app';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Suspense } from 'react';
import { DataRender, SSRCache, initApolloCache } from '../libs/apollo-ssr';

const App = ({ Component, pageProps }: AppProps) => {
  const client = new ApolloClient({
    uri:
      typeof window === 'undefined'
        ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL || 'http://localhost:3000'}/api/graphql`
        : `${location.origin}/api/graphql`,
    cache: new InMemoryCache(),
  });
  initApolloCache(client);

  return (
    <ApolloProvider client={client} suspenseCache={new SSRCache()}>
      <Suspense fallback={'Loading'}>
        <Component {...pageProps} />
      </Suspense>
      <DataRender />
    </ApolloProvider>
  );
};

App.getInitialProps = () => ({ pageProps: {} });

export default App;
