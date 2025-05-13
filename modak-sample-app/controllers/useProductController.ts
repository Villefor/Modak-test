import * as ProductAction from "@/actions/ProductAction";
import { Product } from "@/interfaces/productInterface";
import * as Calendar from "expo-calendar";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Share } from "react-native";

const PAGE_SIZE = 10;

export interface UseProductControllerOptions {
  category?: string;
  sortBy?: "price" | "rating";
  order?: "asc" | "desc";
}

export type SortOption = "priceAsc" | "priceDesc" | "titleAsc";

export function useProductController(opts: UseProductControllerOptions = {}) {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [fullList, setFullList] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [sort, setSort] = useState<SortOption>("priceAsc");

  async function fetchProductList(parameters: {
    category?: string;
    sortBy?: "price" | "rating";
    order?: "asc" | "desc";
  }): Promise<{ data: Product[] | null; error: Error | null }> {
    try {
      const data = await ProductAction.listProducts(parameters);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async function fetchSearchList(
    query: string
  ): Promise<{ data: Product[] | null; error: Error | null }> {
    try {
      const data = await ProductAction.searchProducts(query);
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

    const result = query.trim()
      ? await fetchSearchList(query.trim())
      : await fetchProductList({ ...opts });

    if (result.error || !result.data) {
      throw result.error ?? new Error("Resposta vazia");
    }

    setFullList(result.data);
    setProducts(result.data.slice(0, PAGE_SIZE));
  }, [opts.category, opts.sortBy, opts.order, query]);

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
      const deepLink = Linking.createURL(`product/${product.id}`, {
        scheme: "modaksampleapp",
      });

      const message =
        `That product looks perfect for you!\n\n` +
        `🎁 ${product.title}\n` +
        `💵 Price: USD ${product.price}\n` +
        `⭐ Rating: ${product.rating}\n\n` +
        `Open it here: ${deepLink}`;

      await Share.share({ message, url: deepLink });
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  async function scheduleNotification(product: Product, date: Date) {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão de notificações negada");
      return;
    }

    const nowMs = Date.now();
    const dateMs = date.getTime();
    const secondsUntil = Math.max(Math.floor((dateMs - nowMs) / 1000), 1);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🛒 Shopping Reminder",
        body: `Time to buy ${product.title} for USD ${product.price.toFixed(
          2
        )}`,
        data: { productId: product.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntil,
        repeats: false,
      },
    });
  }

  const handleAddToCalendar = async (product: Product) => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("User denied calendar permissions");
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const defaultCalendar = calendars.find((c) => c.allowsModifications);
      if (!defaultCalendar) {
        Alert.alert("No calendar found");
        return;
      }

      const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      startDate.setHours(9, 0, 0, 0);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

      await Calendar.createEventAsync(defaultCalendar.id, {
        title: "Next item for shopping list",
        notes: `${product.title} — USD ${product.price.toFixed(2)}`,
        startDate,
        endDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      await scheduleNotification(product, startDate);

      Alert.alert("Your item was added to your calendar");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Failed to add to calendar");
    }
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sort) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "titleAsc":
          return a.title.localeCompare(b.title);
      }
    });
  }, [products, sort]);

  const dismissModal = useCallback(() => {
    setModalVisible(false);
    setSelected(null);
  }, []);

  useEffect(() => {
    reloadList();
  }, [reloadList]);

  return {
    products,
    loading,
    error,
    query,
    setQuery,
    sortedProducts,
    sort,
    setSort,
    loadMore,
    selected,
    modalVisible,
    selectProduct,
    handleCategorySelect,
    handleShare,
    handleAddToCalendar,
    dismissModal,
  };
}
