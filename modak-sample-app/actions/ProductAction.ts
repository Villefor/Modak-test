import { Product } from "@/interfaces/productInterface";
import { ProductRepository } from "@/repositories/ProductsRepository";
import { sortProductsBy } from "@/utils/sortingProducts";

const api = new ProductRepository();

export type ListOptions = {
  category?: string;
  sortBy?: "price" | "rating";
  order?: "asc" | "desc";
};

export async function fetchProducts(category?: string) {
  return category ? api.getProductsByCategory(category) : api.getAllProducts();
}

export function applySorting(
  items: Product[],
  sortBy?: "price" | "rating",
  order?: "asc" | "desc"
): Product[] {
  if (!sortBy) return items;
  return sortProductsBy(items, sortBy, order);
}

export async function listProducts(opts: ListOptions = {}): Promise<Product[]> {
  const products = await fetchProducts(opts.category);
  return applySorting(products, opts.sortBy, opts.order);
}

export async function getProductById(id: number): Promise<Product> {
  return api.getProductsById(id);
}

export async function searchProducts(query: string): Promise<Product[]> {
  return api.searchProducts(query);
}
