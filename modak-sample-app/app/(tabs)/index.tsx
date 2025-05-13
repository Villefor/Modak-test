import { CategorySelectorModal } from "@/components/CategoryModal/CategoryModal";
import { ProductList } from "@/components/ProductList/ProductList";
import { ProductModal } from "@/components/ProductModalCard/ProductModalCard";
import { useCategoryController } from "@/controllers/useCategoryController";
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
    handleCategorySelect,
    handleShare,
    handleAddToCalendar,
    dismissModal,
  } = useProductController({
    // se quiser filtrar/ordenar desde o início, passe aqui:
    // category: 'electronics',
    // sortBy: 'price',
    // order: 'asc',
  });

  const {
    categories,
    categoryLoading,
    categoryModalVisible,
    setCategoryModalVisible,
  } = useCategoryController();

  return (
    <View style={{ flex: 1 }}>
      <ProductList
        error={error}
        query={query}
        onChangeQuery={setQuery}
        products={products}
        loading={loading}
        onEndReached={loadMore}
        onSelectProduct={selectProduct}
        onOpenCategoryModal={() => setCategoryModalVisible(true)}
      />
      <ProductModal
        visible={modalVisible}
        product={selected}
        onDismiss={dismissModal}
        handleShare={handleShare}
        handleAddToCalendar={handleAddToCalendar}
      />

      <CategorySelectorModal
        visible={categoryModalVisible}
        onDismiss={() => setCategoryModalVisible(false)}
        onSelect={handleCategorySelect}
        categoryLoading={categoryLoading}
        categories={categories}
      />
    </View>
  );
}
