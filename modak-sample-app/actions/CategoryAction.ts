import { Category } from "@/interfaces/categoryInterface";
import { CategoryRepository } from "@/repositories/CategoriesRepository";

const api = new CategoryRepository();

export async function listCategories(): Promise<Category[]> {
  return api.getAllCategories();
}
