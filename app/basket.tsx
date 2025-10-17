import { useBasket } from "@/hooks/useBasket";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Use the interfaces from the basket slice
import { Basket, BasketItem, Vendor } from "@/store/slices/basketSlice";

export default function BasketScreen() {
  const {
    basket,
    isLoading,
    error,
    removeFromBasket,
    updateQuantity,
    clearBasket,
  } = useBasket();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  // Basket data is managed by the provider

  const refreshBasket = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      // Basket data is managed by the provider, no need to reload
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearBasket = () => {
    clearBasket();
    setShowClearModal(false);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromBasket(itemId);
  };

  const proceedToCheckout = () => {
    router.push("/checkout");
  };

  const VendorItemsSection = ({
    vendor,
    items,
    onQuantityChanged,
    onRemove,
  }: {
    vendor: Vendor;
    items: BasketItem[];
    onQuantityChanged: (item: BasketItem, quantity: number) => void;
    onRemove: (item: BasketItem) => void;
  }) => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Vendor Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
        }}
      >
        <Feather name="shopping-bag" color="#333" size={20} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-Bold",
            color: "#333",
            marginLeft: 8,
            flex: 1,
          }}
        >
          {vendor.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins-Regular",
            color: "#666",
          }}
        >
          {vendor.itemCount} item{vendor.itemCount !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Items */}
      {items.map((item, index) => (
        <View key={item.id}>
          <View
            style={{
              flexDirection: "row",
              padding: 16,
              alignItems: "center",
            }}
          >
            {/* Product Image */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                backgroundColor: "#f0f0f0",
                marginRight: 12,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="cover"
              />
            </View>

            {/* Product Details */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                  color: "#333",
                  marginBottom: 4,
                }}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Poppins-Bold",
                  color: "#333",
                  marginBottom: 4,
                }}
              >
                £{item.price.toFixed(2)}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: "#666",
                }}
              >
                D&@
              </Text>
            </View>

            {/* Remove Button */}
            <TouchableOpacity
              onPress={() => onRemove(item)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                padding: 4,
              }}
            >
              <Feather name="x" color="#999" size={20} />
            </TouchableOpacity>

            {/* Quantity Controls */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => onQuantityChanged(item, item.quantity - 1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#f0f0f0",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="minus" color="#333" size={16} />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                  color: "#333",
                  marginHorizontal: 16,
                  minWidth: 20,
                  textAlign: "center",
                }}
              >
                {item.quantity}
              </Text>

              <TouchableOpacity
                onPress={() => onQuantityChanged(item, item.quantity + 1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#f0f0f0",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="plus" color="#333" size={16} />
              </TouchableOpacity>
            </View>
          </View>

          {index < items.length - 1 && (
            <View
              style={{
                height: 1,
                backgroundColor: "#f0f0f0",
                marginLeft: 16,
              }}
            />
          )}
        </View>
      ))}

      {/* Vendor Totals */}
      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              color: "#666",
            }}
          >
            Subtotal
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              color: "#333",
            }}
          >
            £0.00
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              color: "#666",
            }}
          >
            Protection Fee
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              color: "#333",
            }}
          >
            £0.00
          </Text>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: "#f0f0f0",
            marginVertical: 8,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins-Bold",
              color: "#333",
            }}
          >
            Vendor Total
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins-Bold",
              color: "#333",
            }}
          >
            £0.00
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 24,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
            }}
          >
            Checkout with {vendor.name}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const BasketSummary = ({ basket }: { basket: Basket }) => (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-Regular",
            color: "#333",
          }}
        >
          Subtotal
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-Bold",
            color: "#333",
          }}
        >
          {basket.formattedSubtotal}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-Regular",
            color: "#333",
          }}
        >
          Protection Fee
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-Bold",
            color: "#333",
          }}
        >
          {basket.formattedTotalProtectionFee}
        </Text>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: "#f0f0f0",
          marginVertical: 12,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Poppins-Bold",
            color: "#333",
          }}
        >
          Total
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Poppins-Bold",
            color: "#333",
          }}
        >
          {basket.formattedTotal}
        </Text>
      </View>
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
            Your Basket
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
            Your Basket
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
          <Feather name="alert-circle" color="#ff4444" size={48} />
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontFamily: "Poppins-Bold",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            Error loading basket
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
            onPress={refreshBasket}
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

  if (!basket || basket.items.length === 0) {
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
            Your Basket
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
          <Feather name="shopping-bag" color="#999" size={64} />
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontFamily: "Poppins-Bold",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            Your basket is empty
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
            Items you add to your basket will appear here
          </Text>
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
          Your Basket
        </Text>

        <TouchableOpacity
          onPress={() => setShowClearModal(true)}
          style={{
            marginRight: 16,
            padding: 8,
          }}
        >
          <Feather name="trash-2" color="#fff" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={refreshBasket}
          style={{
            padding: 8,
          }}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Feather name="refresh-cw" color="#fff" size={20} />
          )}
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshBasket}
              tintColor="#007AFF"
            />
          }
        >
          <View style={{ padding: 16 }}>
            {/* Display items by vendor */}
            {basket.vendorIds.map((vendorId) => (
              <VendorItemsSection
                key={vendorId}
                vendor={basket.vendors[vendorId]}
                items={basket.vendorItems[vendorId] || []}
                onQuantityChanged={(item, quantity) =>
                  handleUpdateQuantity(item.id, quantity)
                }
                onRemove={(item) => handleRemoveItem(item.id)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Basket Summary */}
        <BasketSummary basket={basket} />

        {/* Checkout Button */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            paddingBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={proceedToCheckout}
            style={{
              backgroundColor: "#000",
              borderRadius: 8,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontFamily: "Poppins-Bold",
              }}
            >
              Proceed to Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Clear Basket Modal */}
      <Modal
        visible={showClearModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClearModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 24,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins-Bold",
                color: "#333",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Clear Basket
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-Regular",
                color: "#666",
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Are you sure you want to remove all items from your basket?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => setShowClearModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 8,
                  paddingVertical: 12,
                  marginRight: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#333",
                    fontSize: 16,
                    fontFamily: "Poppins-Bold",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleClearBasket}
                style={{
                  flex: 1,
                  backgroundColor: "#ff4444",
                  borderRadius: 8,
                  paddingVertical: 12,
                  marginLeft: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontFamily: "Poppins-Bold",
                  }}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
