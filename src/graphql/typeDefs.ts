import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  scalar Date
  type Query {
    date: Date!
  }
`;
