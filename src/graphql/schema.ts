import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    category: String!
    inStock: Boolean!
    brand: String
  }

  type Query {
    products(inStock: Boolean): [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    toggleProductStock(id: ID!): Product!
  }
`
