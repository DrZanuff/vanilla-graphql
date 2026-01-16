import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '@/types/product';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'products.json');

export async function loadProducts(): Promise<Product[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving products:', error);
    throw error;
  }
}

