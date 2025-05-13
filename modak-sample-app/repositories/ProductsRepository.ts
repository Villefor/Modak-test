import { Product, ProductDetails } from "../interfaces/productInterface";
import baseUrlClient from "./baseUrl";

export class ProductRepository {
  async getAllProducts(): Promise<Product[]> {
    const { data } = await baseUrlClient.get<{ products: ProductDetails[] }>(
      "/products"
    );
    return data.products.map(this.productsModel);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data } = await baseUrlClient.get<{ products: ProductDetails[] }>(
      `/products/category/${category}`
    );
    return data.products.map(this.productsModel);
  }

  async getProductsById(id: number): Promise<Product> {
    const { data } = await baseUrlClient.get<ProductDetails>(`/products/${id}`);
    return this.productsModel(data);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const { data } = await baseUrlClient.get<{ products: ProductDetails[] }>(
      "/products/search",
      { params: { q: query } }
    );
    return data.products.map(this.productsModel);
  }

  private productsModel(details: ProductDetails): Product {
    return {
      id: details.id,
      title: details.title,
      description: details.description,
      price: details.price,
      discountPercentage: details.discountPercentage,
      rating: details.rating,
      stock: details.stock,
      brand: details.brand,
      category: details.category,
      thumbnailUrl: details.thumbnail,
      imageUrls: details.images,
      tags: details.tags,
    };
  }
}
