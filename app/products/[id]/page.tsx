'use client'

import { useParams, useRouter } from 'next/navigation'
import type { ApolloCache } from '@apollo/client'
import type { FetchResult } from '@apollo/client'
// Import generated hooks and types - fully typed based on GraphQL schema
import {
  useProductQuery,
  useToggleProductStockMutation,
  ProductDocument,
  type ToggleProductStockMutation,
} from '@/graphql/generated'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  // Use generated hook - no manual typing needed
  const { data, loading, error } = useProductQuery({
    variables: { id },
    skip: !id,
  })

  // Use generated mutation hook - fully typed
  const [toggleStock, { loading: mutLoading }] = useToggleProductStockMutation({
    // Update function - using generated types
    update(
      cache: ApolloCache,
      result: FetchResult<ToggleProductStockMutation>
    ) {
      const mutationData = result.data
      if (!mutationData) return

      // Update the product query in cache using generated document
      cache.writeQuery({
        query: ProductDocument,
        variables: { id },
        data: {
          product: {
            ...data?.product,
            inStock: mutationData.toggleProductStock.inStock,
          },
        },
      })

      // Also update the products list cache if it exists
      cache.modify({
        id: cache.identify({ __typename: 'Product', id }),
        fields: {
          inStock() {
            return mutationData.toggleProductStock.inStock
          },
        },
      })
    },
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-zinc-600 dark:text-zinc-400">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              Error: {error.message}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!data?.product) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-zinc-600 dark:text-zinc-400">Product not found</p>
        </div>
      </div>
    )
  }

  const product = data.product

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors">
          ← Back to Products
        </button>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-black/[.08] dark:border-white/[.145] p-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-6">
            {product.name}
          </h1>

          <div className="space-y-4 mb-8">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Category
              </p>
              <p className="text-lg text-black dark:text-zinc-50">
                {product.category}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Price
              </p>
              <p className="text-2xl font-bold text-black dark:text-zinc-50">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Stock Status
              </p>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  product.inStock
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              toggleStock({ variables: { id } })
            }}
            disabled={mutLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] disabled:opacity-50 disabled:cursor-not-allowed">
            {mutLoading ? 'Toggling...' : 'Toggle Stock Status'}
          </button>
        </div>
      </div>
    </div>
  )
}
