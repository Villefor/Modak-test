import { Product } from "@/interfaces/productInterface";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Card, Menu, Text } from "react-native-paper";
import { ProductErrorCard } from "../ProductErrorCard/ProductErrorCard";
import { ProductSearchBar } from "../ui/SearchBar";

type ProductListProps = {
  query: string;
  onChangeQuery: (text: string) => void;
  products: Product[];
  loading: boolean;
  error: Error | null;
  onEndReached: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenCategoryModal: () => void;
};

type SortOption = "priceAsc" | "priceDesc" | "titleAsc";

export function ProductList({
  query,
  error,
  onChangeQuery,
  products,
  loading,
  onEndReached,
  onSelectProduct,
  onOpenCategoryModal,
}: ProductListProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [sort, setSort] = useState<SortOption>("priceAsc");
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [cardLoadingId, setCardLoadingId] = useState<number | null>(null);

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

  const handleCardPress = async (product: Product) => {
    setCardLoadingId(product.id);
    setHoveredCardId(product.id);
    setTimeout(() => {
      onSelectProduct(product);
      setCardLoadingId(null);
      setHoveredCardId(null);
    }, 300);
  };

  const renderItem: ListRenderItem<Product> = ({ item }) => (
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
          </View>
        )}
      </Card>
    </TouchableWithoutFeedback>
  );

  const keyExtractor = (item: Product) => item.id.toString();
  const Footer = () =>
    loading ? <ActivityIndicator style={styles.loader} /> : null;

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <ProductSearchBar query={query} onChangeQuery={onChangeQuery} />

        <View style={styles.buttonsRow}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="elevated"
                onPress={() => setMenuVisible(true)}
                icon="sort"
                contentStyle={styles.sortButton}
                style={styles.menuButton}
              >
                Ordenar
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setSort("priceAsc");
                setMenuVisible(false);
              }}
              title="Menor preço"
            />
            <Menu.Item
              onPress={() => {
                setSort("priceDesc");
                setMenuVisible(false);
              }}
              title="Maior preço"
            />
            <Menu.Item
              onPress={() => {
                setSort("titleAsc");
                setMenuVisible(false);
              }}
              title="A-Z"
            />
          </Menu>

          <Button
            mode="elevated"
            icon="tag"
            onPress={onOpenCategoryModal}
            contentStyle={styles.sortButton}
            style={styles.menuButton}
          >
            Categorias
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
  container: {
    flex: 1,
  },
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
  menuButton: {
    marginLeft: 8,
  },
  sortButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    padding: 8,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  cardText: {
    flex: 1,
    justifyContent: "center",
  },
  cardLoading: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    marginVertical: 16,
  },
});
