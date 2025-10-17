import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FavouriteItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  brand?: string;
  condition?: string;
}

export default function FavouritesScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavourites();
  }, []);

  const loadFavourites = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace with actual data fetching
      setFavourites([]);
    } catch (err) {
      setError("Error loading favourites");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    Alert.alert("Login Required", "Please log in to view your favourites", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log In",
        onPress: () => {
          // Navigate to login screen
          router.push("/(auth)");
        },
      },
    ]);
  };

  const navigateToDiscovery = () => {
    router.push("/(tabs)/discovery");
  };

  const removeFromFavourites = (itemId: string) => {
    Alert.alert(
      "Remove from Favourites",
      "Are you sure you want to remove this item from your favourites?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setFavourites((prev) => prev.filter((item) => item.id !== itemId));
            Alert.alert("Success", "Item removed from favourites");
          },
        },
      ]
    );
  };

  const navigateToProduct = (itemId: string) => {
    router.push(`/product/${itemId}`);
  };

  const FavouriteCard = ({ item }: { item: FavouriteItem }) => (
    <TouchableOpacity
      onPress={() => navigateToProduct(item.id)}
      style={{
        backgroundColor: "#333",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
      }}
    >
      {/* Product Image */}
      <View
        style={{
          width: "100%",
          height: 200,
          backgroundColor: "#555",
        }}
      >
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#555",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="image" color="#999" size={48} />
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={{ padding: 12 }}>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontFamily: "Poppins-Bold",
            marginBottom: 4,
          }}
          numberOfLines={2}
        >
          {item.name}
        </Text>

        {item.brand && (
          <Text
            style={{
              color: "#999",
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              marginBottom: 4,
            }}
          >
            {item.brand}
          </Text>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontFamily: "Poppins-Bold",
            }}
          >
            £{item.price.toFixed(2)}
          </Text>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              removeFromFavourites(item.id);
            }}
            style={{
              padding: 8,
            }}
          >
            <Feather name="heart" color="#ff4444" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
      }}
    >
      <Feather name="heart" color="#999" size={64} />
      <Text
        style={{
          color: "#999",
          fontSize: 18,
          fontFamily: "Poppins-Medium",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        No favourites yet
      </Text>
      <TouchableOpacity
        onPress={navigateToDiscovery}
        style={{
          backgroundColor: "#007AFF",
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 24,
          marginTop: 16,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontFamily: "Poppins-Bold",
          }}
        >
          Discover Items
        </Text>
      </TouchableOpacity>
    </View>
  );

  const ErrorState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
      }}
    >
      <Feather name="alert-circle" color="#ff4444" size={64} />
      <Text
        style={{
          color: "#fff",
          fontSize: 18,
          fontFamily: "Poppins-Bold",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        Error loading favourites
      </Text>
      <Text
        style={{
          color: "#999",
          fontSize: 14,
          fontFamily: "Poppins-Regular",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        {error}
      </Text>
      {error?.includes("log in") ? (
        <TouchableOpacity
          onPress={navigateToLogin}
          style={{
            backgroundColor: "#007AFF",
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
            }}
          >
            Log In
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={loadFavourites}
          style={{
            backgroundColor: "#007AFF",
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
            }}
          >
            Try Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#000",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#333",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginRight: 16,
            }}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          <Text
            style={{
              flex: 1,
              fontSize: 18,
              fontFamily: "Poppins-Bold",
              color: "#fff",
            }}
          >
            Favourites
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#000",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#333",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginRight: 16,
            }}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          <Text
            style={{
              flex: 1,
              fontSize: 18,
              fontFamily: "Poppins-Bold",
              color: "#fff",
            }}
          >
            Favourites
          </Text>
        </View>

        <ErrorState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#000",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#333",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginRight: 16,
          }}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontFamily: "Poppins-Bold",
            color: "#fff",
          }}
        >
          Favourites
        </Text>
      </View>

      {/* Content */}
      {favourites.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={favourites}
          renderItem={({ item }) => <FavouriteCard item={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{
            padding: 16,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadFavourites}
              tintColor="#007AFF"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
