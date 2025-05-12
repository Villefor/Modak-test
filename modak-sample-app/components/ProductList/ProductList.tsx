import { Product } from "@/interfaces/productInterface";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
} from "react-native";
import { Card, Text } from "react-native-paper";

type ProductListProps = {
  products: Product[];
  loading: boolean;
  onEndReached: () => void;
  onSelectProduct: (product: Product) => void;
};

export function ProductList({
  products,
  loading,
  onEndReached,
  onSelectProduct,
}: ProductListProps) {
  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <Card style={styles.card} onPress={() => onSelectProduct(item)}>
      <Card.Cover source={{ uri: item.thumbnailUrl }} />
      <Card.Content>
        <Text numberOfLines={1}>{item.title}</Text>
        <Text>USD {item.price.toFixed(2)}</Text>
      </Card.Content>
    </Card>
  );

  const keyExtractor = (item: Product) => item.id.toString();

  const Footer = () =>
    loading ? <ActivityIndicator style={styles.loader} /> : null;

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.list}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={Footer}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  loader: {
    marginVertical: 16,
  },
});
