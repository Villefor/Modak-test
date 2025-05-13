import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export function ProductErrorCard({ message = "No products found." }: Props) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.content}>
          <IconButton icon="cart-off" size={32} />
          <Text variant="titleMedium" style={styles.text}>
            {message}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 20,
    borderRadius: 12,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 8,
    textAlign: "center",
  },
});
