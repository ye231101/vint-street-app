import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface OrderTotals {
  total: number;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  displayStatus: string;
  statusColor: number;
  items: OrderItem[];
  totals: OrderTotals;
}

export default function OrdersScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["All", "In Progress", "Completed", "Cancelled"];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace with actual data fetching
      setOrders([]);
    } catch (err) {
      setError("Error loading orders");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 1: // In Progress
        return orders.filter((order) => order.status === "processing");
      case 2: // Completed
        return orders.filter((order) => order.status === "completed");
      case 3: // Cancelled
        return orders.filter((order) => order.status === "cancelled");
      default: // All
        return orders;
    }
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <View
      style={{
        backgroundColor: "#333",
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
      }}
    >
      {/* Order header */}
      <View style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#fff",
                fontFamily: "Poppins-Bold",
                fontSize: 16,
                marginBottom: 4,
              }}
            >
              Order {order.id}
            </Text>
            <Text
              style={{
                color: "#999",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
              }}
            >
              {formatDate(order.createdAt)}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: `rgba(${order.statusColor}, 0.1)`,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                color: `#${order.statusColor.toString(16).padStart(6, "0")}`,
                fontFamily: "Poppins-Bold",
                fontSize: 12,
              }}
            >
              {order.displayStatus}
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: "#555",
        }}
      />

      {/* Order items */}
      {order.items.map((item, index) => (
        <View key={index}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                backgroundColor: "#555",
                marginRight: 16,
                overflow: "hidden",
              }}
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: 60, height: 60 }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: "#555",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Feather name="image" color="#999" size={24} />
                </View>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                  marginBottom: 4,
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  color: "#999",
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  marginBottom: 4,
                }}
              >
                Quantity: {item.quantity}
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Poppins-Bold",
                  fontSize: 16,
                }}
              >
                £{item.price.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      ))}

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: "#555",
        }}
      />

      {/* Order actions */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontFamily: "Poppins-Bold",
            fontSize: 16,
          }}
        >
          Total: £{order.totals.total.toFixed(2)}
        </Text>
        <TouchableOpacity
          onPress={() => {
            // Navigate to order details
            Alert.alert("Order Details", "This would show order details");
          }}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              color: "#007AFF",
              fontSize: 16,
              fontFamily: "Poppins-Regular",
            }}
          >
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const OrdersList = ({
    orders,
    onRefresh,
  }: {
    orders: Order[];
    onRefresh: () => void;
  }) => {
    if (orders.length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
          }}
        >
          <Feather name="truck" color="#999" size={64} />
          <Text
            style={{
              color: "#999",
              fontSize: 18,
              fontFamily: "Poppins-Medium",
              marginTop: 16,
            }}
          >
            No orders found
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
      >
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ScrollView>
    );
  };

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
            My Orders
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
            My Orders
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
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
            Error loading orders
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
          <TouchableOpacity
            onPress={loadOrders}
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
              Retry
            </Text>
          </TouchableOpacity>
        </View>
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
          My Orders
        </Text>
      </View>

      {/* Tabs */}
      <View
        style={{
          backgroundColor: "#000",
          borderBottomWidth: 1,
          borderBottomColor: "#333",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveTab(index)}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 20,
                marginRight: 8,
                borderBottomWidth: 2,
                borderBottomColor: activeTab === index ? "#fff" : "transparent",
              }}
            >
              <Text
                style={{
                  color: activeTab === index ? "#fff" : "#999",
                  fontSize: 16,
                  fontFamily: "Poppins-Regular",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <OrdersList orders={getFilteredOrders()} onRefresh={loadOrders} />
    </SafeAreaView>
  );
}
