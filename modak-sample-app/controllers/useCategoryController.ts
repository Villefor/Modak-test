import * as CategoryActions from "@/actions/CategoryAction";
import { Category } from "@/interfaces/categoryInterface";
import { useCallback, useEffect, useState } from "react";

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

export type CategoryItem = {
  id: string;
  name: string;
};

export function useCategoryController() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [categoryLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reloadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await fetchCategoryList();
      if (fetchError || !data) {
        throw fetchError ?? new Error("Failed to fetch categories");
      }
      const items: CategoryItem[] = data.map((category) => ({
        id: category.slug,
        name: category.name,
        slug: category.slug,
      }));

      setCategories(items);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadCategories();
  }, [reloadCategories]);

  return {
    categories,
    categoryLoading,
    categoryModalVisible,
    setCategoryModalVisible,
    error,
    reloadCategories,
  };
}
