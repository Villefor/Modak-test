import { Category } from "../interfaces/categoryInterface";
import baseUrlClient from "./baseUrl";

export class CategoryRepository {
  async getAllCategories(): Promise<Category[]> {
    const { data } = await baseUrlClient.get<Category[]>(
      "/products/categories"
    );
    return data;
  }
}
