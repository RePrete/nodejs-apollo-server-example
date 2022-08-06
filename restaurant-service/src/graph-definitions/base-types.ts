import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  interface PaginatedResult {
    pagination: Pagination
  }

  type Pagination {
    total: Int,
    pageCount: Int,
    currentPage: Int
  }

  input PaginationInput {
    page: Int = 1
    limit: Int = 10
  }
`
