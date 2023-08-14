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
