import { Product } from "@/interfaces/productInterface";

export function sortProductsBy(
  products: Product[],
  sortBy: "price" | "rating",
  order: "asc" | "desc" = "asc"
): Product[] {
  return [...products].sort((a, b) => {
    const sorting = a[sortBy] - b[sortBy];
    return order === "desc" ? -sorting : sorting;
  });
}
