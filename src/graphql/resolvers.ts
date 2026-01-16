import { Product } from '@/types/product';
import { loadProducts, saveProducts } from '@/lib/data';

export const resolvers = {
  Query: {
    products: async (_: unknown, args: { inStock?: boolean }): Promise<Product[]> => {
      const products = await loadProducts();
      
      if (args.inStock !== undefined) {
        return products.filter((product) => product.inStock === args.inStock);
      }
      
      return products;
    },
    
    product: async (_: unknown, args: { id: string }): Promise<Product | null> => {
      const products = await loadProducts();
      return products.find((product) => product.id === args.id) || null;
    },
  },
  
  Mutation: {
    toggleProductStock: async (_: unknown, args: { id: string }): Promise<Product> => {
      const products = await loadProducts();
      const product = products.find((p) => p.id === args.id);
      
      if (!product) {
        throw new Error(`Product with id ${args.id} not found`);
      }
      
      product.inStock = !product.inStock;
      await saveProducts(products);
      
      return product;
    },
  },
};

