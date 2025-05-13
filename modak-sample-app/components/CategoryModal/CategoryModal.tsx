import { CategoryItem } from "@/controllers/useCategoryController";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Chip,
  Modal,
  Portal,
  Text,
} from "react-native-paper";

type CategorySelectorModalProps = {
  visible: boolean;
  categoryLoading: boolean;
  categories: CategoryItem[];
  onDismiss: () => void;
  onSelect: (category: string) => void;
};

export function CategorySelectorModal({
  visible,
  categoryLoading,
  categories,
  onDismiss,
  onSelect,
}: CategorySelectorModalProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Text variant="titleMedium" style={styles.title}>
          Selecione uma categoria:
        </Text>

        {categoryLoading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.chipWrapper}>
            {categories.map((product) => (
              <Chip
                key={product.id}
                onPress={() => {
                  onSelect(product.name);
                  onDismiss();
                }}
                style={styles.chip}
              >
                {product.name}
              </Chip>
            ))}
          </View>
        )}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  title: {
    marginBottom: 12,
  },
  chipWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
});
