// useItemsController.ts

import { Product } from "@/interfaces/productInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Toast } from "toastify-react-native";

const storageKey = "savedItems";

export interface UseItemsControllerReturn {
  items: Product[];
  loading: boolean;
  refreshing: boolean;
  storageKey: string;
  onRefresh: () => Promise<void>;
  setItems: Dispatch<SetStateAction<Product[]>>;
  loadItems: () => Promise<void>;
}

export function useWishListController(): UseItemsControllerReturn {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const json = await AsyncStorage.getItem(storageKey);
      if (json) {
        setItems(JSON.parse(json));
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
      Toast.error("Something went wrong while loading items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, [loadItems]);

  return {
    items,
    loading,
    refreshing,
    storageKey,
    setItems,
    onRefresh,
    loadItems,
  };
}
