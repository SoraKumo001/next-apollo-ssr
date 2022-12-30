import { gql } from '@apollo/client';

export const typeDefs = gql`
  scalar Date
  type Query {
    date: Date!
  }
`;
