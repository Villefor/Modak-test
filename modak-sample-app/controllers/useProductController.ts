import * as ProductAction from "@/actions/ProductAction";
import { Product } from "@/interfaces/productInterface";
import { useCallback, useEffect, useState } from "react";
import { Share } from "react-native";

const PAGE_SIZE = 10;

export interface UseProductControllerOptions {
  category?: string;
  sortBy?: "price" | "rating";
  order?: "asc" | "desc";
}

export function useProductController(opts: UseProductControllerOptions = {}) {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [fullList, setFullList] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  async function fetchProductList(params: {
    category?: string;
    sortBy?: "price" | "rating";
    order?: "asc" | "desc";
  }): Promise<{ data: Product[] | null; error: Error | null }> {
    try {
      const data = await ProductAction.listProducts(params);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async function fetchProductDetails(
    id: number
  ): Promise<{ data: Product | null; error: Error | null }> {
    try {
      const data = await ProductAction.getProductById(id);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  const reloadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPage(0);

    try {
      const { data, error: fetchError } = await fetchProductList({
        ...opts,
      });
      if (fetchError || !data) {
        throw fetchError ?? new Error("Resposta vazia");
      }

      const filtered = data.filter((p) =>
        p.title.toLowerCase().includes(query.trim().toLowerCase())
      );

      setFullList(filtered);
      setProducts(filtered.slice(0, PAGE_SIZE));
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [opts.category, opts.sortBy, opts.order, query]);

  useEffect(() => {
    reloadList();
  }, [reloadList]);

  const loadMore = useCallback(() => {
    if (loading) return;
    const nextPage = page + 1;
    const start = 0;
    const end = (nextPage + 1) * PAGE_SIZE;

    setProducts(fullList.slice(start, end));
    setPage(nextPage);
  }, [fullList, loading, page]);

  const selectProduct = useCallback(async (prod: Product) => {
    setLoading(true);
    try {
      const { data, error: detailError } = await fetchProductDetails(prod.id);
      if (detailError || !data) throw detailError ?? new Error("No details");
      setSelected(data);
      setModalVisible(true);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCategorySelect = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    setPage(0);

    try {
      const { data, error: fetchError } = await fetchProductList({ category });

      if (fetchError || !data || data.length === 0) {
        throw fetchError ?? new Error("Nenhum resultado encontrado");
      }

      setFullList(data);
      setProducts(data.slice(0, PAGE_SIZE));
    } catch (err: any) {
      setError(err);
      setFullList([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleShare = async (product: Product) => {
    try {
      await Share.share({
        message:
          `That product looks perfect for you!\n\n` +
          `🎁 ${product.title}\n` +
          `💵 Price: USD ${product.price.toFixed(2)}\n` +
          `⭐ Rating: ${product.rating}\n` +
          `${product.imageUrls[0]}`,
        url: product.imageUrls[0],
      });
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  const dismissModal = useCallback(() => {
    setModalVisible(false);
    setSelected(null);
  }, []);

  return {
    products,
    loading,
    error,
    query,
    setQuery,
    loadMore,
    selected,
    modalVisible,
    selectProduct,
    handleCategorySelect,
    handleShare,
    dismissModal,
  };
}
