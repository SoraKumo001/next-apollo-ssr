import { gql, useApolloClient, useSuspenseQuery } from '@apollo/client';

// 日付を取り出すQuery
const QUERY = gql`
  query date {
    date
  }
`;

const Page = () => {
  const { data, refetch } = useSuspenseQuery<{ date: string }>(QUERY);
  const client = useApolloClient();
  return (
    <>
      <button onClick={() => refetch()}>Reload</button>
      <button onClick={() => client.resetStore()}>Reset</button>
      <div>
        {data?.date && new Date(data.date).toLocaleString('ja-jp', { timeZone: 'Asia/Tokyo' })}
      </div>
    </>
  );
};

export default Page;
