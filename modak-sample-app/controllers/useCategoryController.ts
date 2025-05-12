// src/controllers/CategoryController.ts
import * as CategoryActions from "@/actions/CategoryAction";
import { Category } from "@/interfaces/categoryInterface";

export async function fetchCategoryList(): Promise<{
  data: Category[] | null;
  error: Error | null;
}> {
  try {
    const data = await CategoryActions.listCategories();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}
