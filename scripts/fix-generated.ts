#!/usr/bin/env tsx
/**
 * Post-codegen script to fix compatibility issues with Apollo Client v4.1.0
 *
 * This script:
 * 1. Changes Apollo imports from '@apollo/client' to '@apollo/client/react' for hooks
 * 2. Removes/commments out suspense query functions that use skipToken (not available in v4.1.0)
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const generatedPath = join(process.cwd(), 'src/graphql/generated.ts')

console.log('Fixing generated.ts for Apollo Client v4.1.0 compatibility...')

let content = readFileSync(generatedPath, 'utf-8')

// Fix 1: Change Apollo import to use /react subpath for hooks
content = content.replace(
  /import \* as Apollo from '@apollo\/client';/,
  "import * as Apollo from '@apollo/client/react';"
)

// Fix 2: Comment out suspense query functions that use skipToken
// Remove the entire suspense query function block including any leftover code
content = content.replace(
  /\/\/ @ts-ignore\nexport function use(\w+)SuspenseQuery\([^)]+\): Apollo\.UseSuspenseQueryResult<[^>]+>;\nexport function use\1SuspenseQuery\([^)]+\): Apollo\.UseSuspenseQueryResult<[^>]+>;\nexport function use\1SuspenseQuery\([^)]+\) \{[^}]+\}\s+return Apollo\.useSuspenseQuery<[^>]+>\([^)]+\);\s+\}/gs,
  '// Suspense queries disabled - skipToken not available in Apollo Client v4.1.0\n// export function use$1SuspenseQuery(...) { ... }'
)

// Fix 2b: Remove any leftover suspense query return statements
content = content.replace(
  /\/\/ Suspense queries disabled[^\n]+\n\/\/ export function use\w+SuspenseQuery\([^\n]+\n\s+return Apollo\.useSuspenseQuery<[^>]+>\([^)]+\);\s+\}/g,
  '// Suspense queries disabled - skipToken not available in Apollo Client v4.1.0\n// export function use...SuspenseQuery(...) { ... }'
)

// Fix 3: Comment out suspense query type exports
content = content.replace(
  /export type (\w+)SuspenseQueryHookResult = ReturnType<typeof use\1SuspenseQuery>;/g,
  '// Suspense query types removed - not available in Apollo Client v4.1.0\n// export type $1SuspenseQueryHookResult = ...;'
)

writeFileSync(generatedPath, content, 'utf-8')

console.log('✅ Fixed generated.ts')
