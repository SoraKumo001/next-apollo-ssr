import { useSuspenseQuery_experimental as useSuspenseQuery } from '@apollo/client';
import { gql } from 'apollo-server-micro';

const SAY_HELLO = gql`
  query date {
    date
  }
`;

const Page = () => {
  const { data, refetch } = useSuspenseQuery(SAY_HELLO);
  return (
    <div>
      <div>
        <button
          onClick={() => {
            refetch();
          }}
        >
          Reload
        </button>
      </div>
      {data?.date && new Date(data.date).toLocaleString('ja-jp', { timeZone: 'Asia/Tokyo' })}
    </div>
  );
};

export default Page;
