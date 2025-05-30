import { Product } from "@/interfaces/productInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { Toast } from "toastify-react-native";

const STORAGE_KEY = "savedItems";

export default function WishList() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        setItems(JSON.parse(json));
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
      Toast.error("Something went wrong while loading items");
    } finally {
      setLoading(false);
      Toast.info("List reloaded");
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, [loadItems]);

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.cardContainer} testID={`itemCard-${item.id}`}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.thumbnailUrl }} />
        <Card.Title
          title={item.title}
          subtitle={`USD ${item.price.toFixed(2)}`}
        />
        <Card.Actions>
          <Button
            testID={`removeButton-${item.id}`}
            onPress={async () => {
              const filtered = items.filter((p) => p.id !== item.id);
              setItems(filtered);
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
              Toast.success("Item removed");
            }}
          >
            Remove
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator testID="loadingIndicator" />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="wishListScreen">
      <View style={styles.header}>
        <Text style={styles.title} testID="headerTitle">
          Wish List
        </Text>
        {items.length > 0 && (
          <Button
            icon="reload"
            mode="outlined"
            onPress={loadItems}
            compact
            testID="reloadButton"
          >
            Reload
          </Button>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.center}>
          <Text>No items saved.</Text>
          <Button
            mode="contained"
            onPress={loadItems}
            style={styles.reloadButton}
            testID="reloadButtonEmpty"
          >
            Reload
          </Button>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              testID="pullToRefresh"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: "10%",
    marginTop: "10%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  cardContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  card: {
    width: "90%",
    borderRadius: 8,
    overflow: "hidden",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  reloadButton: {
    marginTop: 12,
  },
});
