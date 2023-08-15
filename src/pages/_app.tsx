import type { AppType } from 'next/app';
import { useState } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ApolloSSRProvider } from '@react-libraries/apollo-ssr';

const uri = 'https://graphql.anilist.co';

const App: AppType = ({ Component }) => {
  const [client] = useState(
    () =>
      new ApolloClient({
        uri,
        cache: new InMemoryCache({}),
      })
  );
  return (
    <ApolloProvider client={client}>
      {/* ←Add this */}
      <ApolloSSRProvider>
        <Component />
      </ApolloSSRProvider>
    </ApolloProvider>
  );
};

// getInitialProps itself is not needed, but it is needed to prevent optimization of _app.tsx
// If you don't include this, it will be executed at build time and will not be called after that.
App.getInitialProps = () => ({});

export default App;
