'use client'

import { useState } from 'react'
import Link from 'next/link'
// Import generated hook - fully typed based on GraphQL schema
import { useProductsQuery } from '@/graphql/generated'

export default function ProductsPage() {
  const [filterInStock, setFilterInStock] = useState<boolean | undefined>(
    undefined
  )

  // Use generated hook - no manual typing needed, types come from schema
  const { data, loading, error } = useProductsQuery({
    variables: { inStock: filterInStock },
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-8">
          Products
        </h1>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFilterInStock(undefined)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              filterInStock === undefined
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'border-black/[.08] dark:border-white/[.145] hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]'
            }`}>
            All
          </button>
          <button
            onClick={() => setFilterInStock(true)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              filterInStock === true
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'border-black/[.08] dark:border-white/[.145] hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]'
            }`}>
            In Stock
          </button>
          <button
            onClick={() => setFilterInStock(false)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              filterInStock === false
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'border-black/[.08] dark:border-white/[.145] hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]'
            }`}>
            Out of Stock
          </button>
        </div>

        {loading && (
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">
              Error: {error.message}
            </p>
          </div>
        )}

        {data && (
          <div className="grid gap-4">
            {data.products.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400">
                No products found.
              </p>
            ) : (
              data.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="block bg-white dark:bg-zinc-900 rounded-lg border border-black/[.08] dark:border-white/[.145] p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                        {product.name}
                      </h2>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-1">
                        {product.category}
                      </p>
                      <p className="text-lg font-medium text-black dark:text-zinc-50">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.inStock
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
