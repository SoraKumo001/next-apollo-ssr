# next-apollo-ssr

Sample of SSR in Next.js using useSuspenseQuery from `@apollo/client@3.8`.

Originally, useSuspenseQuery assumes StreamingSSR, but it is rendered when the necessary data is available.

- Demo
  <https://next-apollo-ssr-six.vercel.app/>

# Sample

- src/pages/\_app.tsx

```tsx
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
```

- src/pages/index.tsx

```tsx
import { gql, useApolloClient, useSuspenseQuery } from '@apollo/client';

// Retrieving the animation list
const QUERY = gql`
  {
    Page {
      media {
        siteUrl
        title {
          english
          native
        }
        description
      }
    }
  }
`;

type PageData = {
  Page: { media: { siteUrl: string; title: { english: string; native: string } }[] };
};

const Page = () => {
  const { data, refetch } = useSuspenseQuery<PageData>(QUERY);
  const client = useApolloClient();
  return (
    <>
      <button onClick={() => refetch()}>Reload</button>
      <button onClick={() => client.resetStore()}>Reset</button>
      {data.Page.media.map((v) => (
        <div
          key={v.siteUrl}
          style={{ border: 'solid 1px', padding: '8px', margin: '8px', borderRadius: '4px' }}
        >
          <div>
            {v.title.english} / {v.title.native}
          </div>
          <a href={v.siteUrl}>{v.siteUrl}</a>
        </div>
      ))}
      <div></div>
    </>
  );
};

export default Page;
```
