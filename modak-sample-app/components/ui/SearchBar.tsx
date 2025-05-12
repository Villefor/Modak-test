import React from "react";
import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";

type ProductSearchBarProps = {
  query: string;
  onChangeQuery: (text: string) => void;
  placeholder?: string;
};

export function ProductSearchBar({
  query,
  onChangeQuery,
  placeholder = "Hey! you can search for products here",
}: ProductSearchBarProps) {
  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeQuery}
      value={query}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
});
