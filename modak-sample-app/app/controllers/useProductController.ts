import * as ProductActions from "@/app/actions/ProductAction";
import { Product } from "@/interfaces/productInterface";

export async function fetchProductList(params: {
  category?: string;
  sortBy?: "price" | "rating";
  order?: "asc" | "desc";
}): Promise<{ data: Product[] | null; error: Error | null }> {
  try {
    const data = await ProductActions.listProducts(params);
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export async function fetchProductDetails(
  id: number
): Promise<{ data: Product | null; error: Error | null }> {
  try {
    const data = await ProductActions.getProductById(id);
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}
