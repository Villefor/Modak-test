import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Menu } from "react-native-paper";

export type SortOption = "priceAsc" | "priceDesc" | "titleAsc";

type ProductSortMenuProps = {
  sortOption: SortOption;
  onChangeSort: (option: SortOption) => void;
};

export function ProductSort({
  sortOption,
  onChangeSort,
}: ProductSortMenuProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Button
          mode="elevated"
          icon="sort"
          onPress={() => setVisible(true)}
          contentStyle={styles.buttonContent}
        >
          Sort
        </Button>
      }
    >
      <Menu.Item
        onPress={() => {
          onChangeSort("priceAsc");
          setVisible(false);
        }}
        title="Price: Lowest first"
      />
      <Menu.Item
        onPress={() => {
          onChangeSort("priceDesc");
          setVisible(false);
        }}
        title="Price: Highest first"
      />
      <Menu.Item
        onPress={() => {
          onChangeSort("titleAsc");
          setVisible(false);
        }}
        title="Title: A–Z"
      />
    </Menu>
  );
}

const styles = StyleSheet.create({
  buttonContent: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
});
