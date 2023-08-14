import type { AppType } from 'next/app';
import { Suspense } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { SSRProvider } from '../libs/apollo-ssr';

const uri = 'https://graphql.anilist.co';

const App: AppType = ({ Component, pageProps }) => {
  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache({}),
  });

  return (
    <ApolloProvider client={client}>
      <SSRProvider>
        <Suspense fallback={'Loading'}>
          <Component {...pageProps} />
        </Suspense>
      </SSRProvider>
    </ApolloProvider>
  );
};

// getInitialProps itself is not needed, but it is needed to prevent optimization of _app.tsx
// If you don't include this, it will be executed at build time and will not be called after that.
App.getInitialProps = () => ({ pageProps: {} });

export default App;
