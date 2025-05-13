import { Product } from "@/interfaces/productInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";
import { ProductErrorCard } from "../ProductErrorCard/ProductErrorCard";
import { ProductSort } from "../SortButton/ProductSort";
import { ProductSearchBar } from "../ui/SearchBar";

type SortOption = "priceAsc" | "priceDesc" | "titleAsc";

type ProductListProps = {
  query: string;
  sort: SortOption;
  setQuery: (text: string) => void;
  products: Product[];
  loading: boolean;
  error: Error | null;
  onEndReached: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenCategoryModal: () => void;
  sortedProducts: Product[];
  setSort: (value: SortOption) => void;
};

const STORAGE_KEY = "savedItems";

// Componente de botão de “heart” com animação
function FavoriteButton({
  isFavorite,
  onPress,
}: {
  isFavorite: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <IconButton
        icon={isFavorite ? "heart" : "heart-outline"}
        size={24}
        onPress={handlePress}
      />
    </Animated.View>
  );
}

export function ProductList({
  query,
  error,
  setQuery,
  sortedProducts,
  sort,
  setSort,
  products,
  loading,
  onEndReached,
  onSelectProduct,
  onOpenCategoryModal,
}: ProductListProps) {
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [cardLoadingId, setCardLoadingId] = useState<number | null>(null);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  // 1) carrega do AsyncStorage o array de Product e extrai só os ids
  const loadSaved = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const products: Product[] = JSON.parse(json);
        setSavedIds(products.map((p) => p.id));
      } else {
        setSavedIds([]);
      }
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    }
  }, []);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  // 2) adiciona/remove o Product completo no AsyncStorage
  const toggleSave = async (product: Product) => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const savedProducts: Product[] = json ? JSON.parse(json) : [];
      let newSaved: Product[];
      if (savedProducts.find((p) => p.id === product.id)) {
        newSaved = savedProducts.filter((p) => p.id !== product.id);
      } else {
        newSaved = [...savedProducts, product];
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
      setSavedIds(newSaved.map((p) => p.id));
    } catch (err) {
      console.error("Erro ao atualizar favoritos:", err);
    }
  };

  const handleCardPress = (product: Product) => {
    setCardLoadingId(product.id);
    setHoveredCardId(product.id);
    setTimeout(() => {
      onSelectProduct(product);
      setCardLoadingId(null);
      setHoveredCardId(null);
    }, 300);
  };

  const renderItem: ListRenderItem<Product> = ({ item }) => {
    const isFavorite = savedIds.includes(item.id);
    return (
      <TouchableWithoutFeedback
        onPressIn={() => setHoveredCardId(item.id)}
        onPressOut={() => setHoveredCardId(null)}
        onPress={() => handleCardPress(item)}
      >
        <Card
          style={[styles.card, hoveredCardId === item.id && styles.shadowCard]}
          elevation={2}
        >
          {cardLoadingId === item.id ? (
            <View style={styles.cardLoading}>
              <ActivityIndicator size="small" />
            </View>
          ) : (
            <View style={styles.cardContent}>
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={styles.cardImage}
              />
              <View style={styles.cardText}>
                <Text variant="titleSmall" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text variant="bodyMedium">USD {item.price.toFixed(2)}</Text>
              </View>
              <FavoriteButton
                isFavorite={isFavorite}
                onPress={() => toggleSave(item)}
              />
            </View>
          )}
        </Card>
      </TouchableWithoutFeedback>
    );
  };

  const keyExtractor = (item: Product) => item.id.toString();
  const Footer = () =>
    loading ? <ActivityIndicator style={styles.loader} /> : null;

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <ProductSearchBar query={query} onChangeQuery={setQuery} />

        <View style={styles.buttonsRow}>
          <ProductSort sortOption={sort} onChangeSort={setSort} />
          <Button
            mode="elevated"
            icon="tag"
            onPress={onOpenCategoryModal}
            contentStyle={styles.sortButton}
            style={styles.menuButton}
          >
            Categories
          </Button>
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <ProductErrorCard message={error.message} onRetry={onEndReached} />
        </View>
      ) : (
        <FlatList
          data={sortedProducts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={Footer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: {
    marginTop: "6%",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  menuButton: { marginLeft: 8 },
  sortButton: { paddingVertical: 4, paddingHorizontal: 6 },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  shadowCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  cardText: { flex: 1, justifyContent: "center" },
  cardLoading: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: { marginVertical: 16 },
});
