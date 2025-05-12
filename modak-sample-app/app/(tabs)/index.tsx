import { ProductList } from "@/components/ProductList/ProductList";
import { ProductModal } from "@/components/ProductModalCard/ProductModalCard";
import { ProductSearchBar } from "@/components/ui/SearchBar";
import { useProductController } from "@/controllers/useProductController";
import React from "react";
import { View } from "react-native";

export default function HomeScreen() {
  const {
    products,
    loading,
    error,
    query,
    setQuery,
    loadMore,
    selected,
    modalVisible,
    selectProduct,
    dismissModal,
  } = useProductController({
    // se quiser filtrar/ordenar desde o início, passe aqui:
    // category: 'electronics',
    // sortBy: 'price',
    // order: 'asc',
  });

  return (
    <View style={{ flex: 1 }}>
      <ProductSearchBar query={query} onChangeQuery={setQuery} />
      <ProductList
        products={products}
        loading={loading}
        onEndReached={loadMore}
        onSelectProduct={selectProduct}
      />
      <ProductModal
        visible={modalVisible}
        product={selected}
        onDismiss={dismissModal}
      />
    </View>
  );
}
