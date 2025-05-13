// app/product/[id].tsx
import { useProductController } from "@/controllers/useProductController";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { selectProduct, selected } = useProductController();

  useEffect(() => {
    if (id) {
      selectProduct({ id: Number(id) } as any);
    }
  }, [id]);

  if (!selected) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading product…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{selected.title}</Text>
      <Text>Brand: {selected.brand}</Text>
      <Text>Price: USD {selected.price.toFixed(2)}</Text>
    </View>
  );
}
