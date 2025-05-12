import { Product } from "@/interfaces/productInterface";
import React from "react";
import { StyleSheet } from "react-native";
import { Button, Card, Modal, Portal, Text } from "react-native-paper";

type ProductModalProps = {
  visible: boolean;
  product: Product | null;
  onDismiss: () => void;
};

export function ProductModal({
  visible,
  product,
  onDismiss,
}: ProductModalProps) {
  if (!product) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Card>
          <Card.Cover source={{ uri: product.imageUrls[0] }} />
          <Card.Content>
            <Text variant="titleMedium">{product.title}</Text>
            <Text>{product.description}</Text>
            <Text>Brand: {product.brand}</Text>
            <Text>Stock: {product.stock}</Text>
            <Text>Rating: {product.rating}</Text>
            <Text>Price: USD {product.price.toFixed(2)}</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={onDismiss}>Fechar</Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
});
