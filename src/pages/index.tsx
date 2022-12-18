import { gql, useSuspenseQuery_experimental as useSuspenseQuery } from '@apollo/client';

// 日付を取り出すQuery
const QUERY = gql`
  query date {
    date
  }
`;

const Page = () => {
  const { data, refetch } = useSuspenseQuery(QUERY);
  return (
    <>
      <button onClick={() => refetch()}>Reload</button>
      <div>
        {data?.date && new Date(data.date).toLocaleString('ja-jp', { timeZone: 'Asia/Tokyo' })}
      </div>
    </>
  );
};

export default Page;
