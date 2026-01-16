import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  // Load schema from the GraphQL schema file (works without server running)
  // Alternative: use endpoint 'http://localhost:3000/api/graphql' when server is running
  schema: './src/graphql/schema.graphql',

  // Scan all .graphql files inside src/
  documents: ['src/**/*.graphql'],

  // Generate a single output file
  generates: {
    'src/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        // Use Apollo Client hooks
        withHooks: true,
        // Generate types for all operations
        withComponent: false,
        withHOC: false,
        // Use Apollo Client v4+ style
        apolloClientVersion: 4,
        // Import hooks from @apollo/client/react instead of @apollo/client
        reactApolloVersion: 4,
        // Disable suspense queries to avoid skipToken issues with Apollo Client v4.1.0
        withSuspenseQuery: false,
        // Use the correct import path for Apollo Client v4 hooks
        apolloClientImportFrom: '@apollo/client',
        // This tells the plugin to import hooks from react subpath
        addDocBlocks: true,
      },
    },
  },
}

export default config
