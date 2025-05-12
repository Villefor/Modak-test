import { Product } from "@/interfaces/productInterface";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Modal,
  Portal,
  Text,
} from "react-native-paper";

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
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.card}>
          <Card.Title
            title={product.title}
            subtitle={product.brand}
            left={(props) => <Avatar.Icon {...props} icon="heart" />}
          />
          <Card.Cover
            source={{ uri: product.imageUrls[0] }}
            style={styles.cover}
          />
          <Card.Content style={styles.cardContent}>
            {product.tags && product.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {product.tags.map((tag) => (
                  <Chip key={tag} icon="label" style={styles.tagChip}>
                    {tag}
                  </Chip>
                ))}
              </View>
            )}

            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialIcons name="inventory" size={20} />
                <Text style={styles.infoText}>Stock: {product.stock}</Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialIcons name="star" size={20} />
                <Text style={styles.infoText}>{product.rating}</Text>
              </View>
            </View>

            <View style={styles.priceRow}>
              <MaterialIcons name="attach-money" size={20} />
              <Text style={[styles.infoText, styles.priceText]}>
                USD {product.price.toFixed(2)}
              </Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button onPress={onDismiss}>Close</Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    borderRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  cover: {
    margin: 16,
    borderRadius: 4,
  },
  cardContent: {
    paddingHorizontal: 16,
  },
  description: {
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tagChip: {
    marginRight: 6,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  priceText: {
    fontWeight: "bold",
  },
});
