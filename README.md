# Next.js + GraphQL with Code Generation

A Next.js project demonstrating GraphQL API integration with both **code-generated typed hooks** and **manual gql queries**.

## 🎯 Features

- **GraphQL API** built with GraphQL Yoga inside Next.js App Router
- **File-based data persistence** (JSON storage, no database)
- **GraphQL Code Generator** for end-to-end type safety
- **Apollo Client** integration with React hooks
- **Two implementation approaches**:
  - ✅ **Codegen approach**: Fully typed hooks generated from schema
  - ✅ **Manual approach**: Traditional gql queries with manual typing
- **TypeScript** throughout
- **Product management** with queries and mutations

## 📋 Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Generate GraphQL Types

Before running the development server, generate TypeScript types from your GraphQL schema:

```bash
pnpm codegen
```

This command:

- Reads the GraphQL schema from `src/graphql/schema.graphql`
- Scans all `.graphql` files in `src/`
- Generates typed hooks and types to `src/graphql/generated.ts`
- Applies compatibility fixes for Apollo Client v4.1.0

### 3. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
vanilla-graphql/
├── app/
│   ├── api/
│   │   └── graphql/
│   │       └── route.ts          # GraphQL API endpoint
│   ├── products/
│   │   ├── page.tsx              # Products list (Codegen)
│   │   └── [id]/
│   │       └── page.tsx          # Product detail (Codegen)
│   └── products-manual/
│       ├── page.tsx              # Products list (Manual gql)
│       └── [id]/
│           └── page.tsx         # Product detail (Manual gql)
├── src/
│   ├── components/
│   │   └── ApolloProvider.tsx   # Apollo Client provider
│   ├── data/
│   │   └── products.json        # Data storage (JSON file)
│   ├── graphql/
│   │   ├── schema.graphql       # GraphQL schema definition
│   │   ├── generated.ts         # Generated types & hooks (auto-generated)
│   │   ├── queries/
│   │   │   ├── products.graphql
│   │   │   └── product.graphql
│   │   └── mutations/
│   │       └── toggleProductStock.graphql
│   ├── lib/
│   │   ├── apolloClient.ts      # Apollo Client configuration
│   │   └── data.ts              # File I/O utilities
│   └── types/
│       └── product.ts           # TypeScript types
├── scripts/
│   └── fix-generated.ts         # Post-codegen compatibility fixes
├── codegen.ts                    # GraphQL Code Generator config
└── package.json
```

## 🔧 Available Scripts

- `pnpm dev` - Start Next.js development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm codegen` - Generate GraphQL types and hooks
- `pnpm codegen:watch` - Watch mode for code generation
- `pnpm lint` - Run ESLint

## 📚 GraphQL Schema

```graphql
type Product {
  id: ID!
  name: String!
  price: Float!
  category: String!
  inStock: Boolean!
}

type Query {
  products(inStock: Boolean): [Product!]!
  product(id: ID!): Product
}

type Mutation {
  toggleProductStock(id: ID!): Product!
}
```

## 🎨 Two Implementation Approaches

### Approach 1: Codegen (Recommended)

**Location**: `/products` and `/products/[id]`

Uses GraphQL Code Generator to create fully typed hooks:

```tsx
import { useProductsQuery } from '@/graphql/generated'

const { data, loading, error } = useProductsQuery({
  variables: { inStock: filterInStock },
})
// data is fully typed - no manual typing needed!
```

**Benefits**:

- ✅ Full type safety from schema
- ✅ Auto-completion in IDE
- ✅ Type errors if schema changes
- ✅ Less boilerplate

### Approach 2: Manual gql

**Location**: `/products-manual` and `/products-manual/[id]`

Uses traditional `gql` template literals with manual typing:

```tsx
import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'

const GET_PRODUCTS = gql`
  query Products($inStock: Boolean) {
    products(inStock: $inStock) {
      id
      name
      price
    }
  }
`

const { data, loading, error } = useQuery<{ products: Product[] }>(
  GET_PRODUCTS,
  { variables: { inStock: filterInStock } }
)
```

**Benefits**:

- ✅ More control over queries
- ✅ No codegen step required
- ✅ Easier to understand for beginners

## 🔄 Code Generation Workflow

1. **Define your schema** in `src/graphql/schema.graphql`
2. **Write queries/mutations** in `.graphql` files under `src/graphql/`
3. **Run codegen**: `pnpm codegen`
4. **Import generated hooks** in your components
5. **Enjoy full type safety!**

### Example Workflow

```bash
# 1. Add a new query to src/graphql/queries/myQuery.graphql
query MyQuery {
  products {
    id
    name
  }
}

# 2. Generate types
pnpm codegen

# 3. Use the generated hook
import { useMyQueryQuery } from '@/graphql/generated'
```

## 🛠️ Configuration

### GraphQL Code Generator

Configuration is in `codegen.ts`:

- **Schema**: `src/graphql/schema.graphql`
- **Documents**: All `.graphql` files in `src/`
- **Output**: `src/graphql/generated.ts`
- **Plugins**: TypeScript, TypeScript Operations, React Apollo

### Apollo Client

Configured in `src/lib/apolloClient.ts`:

- Endpoint: `/api/graphql`
- Cache: InMemoryCache with type policies

## 📝 Data Storage

Data is persisted in `src/data/products.json`. The GraphQL resolvers:

- Load data from the JSON file on queries
- Write back to the file on mutations

**Note**: In production/serverless environments, file system may be ephemeral. This is for learning/demo purposes.

## 🎓 Learning Points

This project demonstrates:

1. **GraphQL API** inside Next.js App Router
2. **Schema-driven development** with code generation
3. **Type-safe GraphQL** queries and mutations
4. **Apollo Client** integration patterns
5. **Cache management** with Apollo
6. **Two approaches** to GraphQL in React

## 🐛 Troubleshooting

### Codegen errors

If you see `skipToken` errors:

- The post-codegen script should fix this automatically
- If not, check `scripts/fix-generated.ts` is running after codegen

### Type errors

- Make sure you've run `pnpm codegen` after changing `.graphql` files
- Restart your TypeScript server in your IDE

### Import errors

- Verify `tsconfig.json` has correct path aliases: `"@/*": ["./src/*"]`
- Check that `src/graphql/generated.ts` exists

## 📖 Resources

- [GraphQL Code Generator Docs](https://the-guild.dev/graphql/codegen)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)

## 📄 License

MIT
