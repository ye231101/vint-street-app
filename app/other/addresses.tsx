import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Address {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  phone?: string;
  type: "shipping" | "billing";
}

export default function AddressesScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace with actual data fetching
      setShippingAddress(null);
      setBillingAddress(null);
    } catch (err) {
      setError("Error loading addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = (type: "shipping" | "billing") => {
    router.push(`/other/address-form?type=${type}` as any);
  };

  const editAddress = (type: "shipping" | "billing") => {
    const address = type === "shipping" ? shippingAddress : billingAddress;
    if (address) {
      router.push(
        `/other/address-form?type=${type}&edit=true&id=${address.id}` as any
      );
    }
  };

  const deleteAddress = (type: "shipping" | "billing") => {
    Alert.alert(
      `Delete ${type} Address`,
      `Are you sure you want to delete your ${type} address?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Simulate API call
              await new Promise((resolve) => setTimeout(resolve, 500));

              if (type === "shipping") {
                setShippingAddress(null);
              } else {
                setBillingAddress(null);
              }

              Alert.alert("Success", `${type} address deleted`);
            } catch (err) {
              Alert.alert("Error", "Failed to delete address");
            }
          },
        },
      ]
    );
  };

  const AddressSection = ({
    title,
    subtitle,
    icon,
    address,
    addressType,
    onAdd,
    onEdit,
    onDelete,
  }: {
    title: string;
    subtitle: string;
    icon: string;
    address: Address | null;
    addressType: "shipping" | "billing";
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
  }) => (
    <View
      style={{
        backgroundColor: "#333",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      {/* Section Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0, 122, 255, 0.1)",
            borderRadius: 8,
            padding: 8,
            marginRight: 12,
          }}
        >
          <Feather name={icon as any} color="#007AFF" size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontFamily: "Poppins-Bold",
              marginBottom: 4,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              color: "#999",
              fontSize: 14,
              fontFamily: "Poppins-Regular",
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Address Content */}
      {address ? (
        <AddressCard
          name={address.name}
          address={`${address.addressLine1}${
            address.addressLine2 ? `, ${address.addressLine2}` : ""
          }, ${address.city}, ${address.state ? `${address.state}, ` : ""}${
            address.postcode
          }, ${address.country}`}
          phone={address.phone || ""}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <View
          style={{
            backgroundColor: "#444",
            borderRadius: 8,
            padding: 20,
            borderWidth: 1,
            borderColor: "#555",
            borderStyle: "solid",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Feather name={icon as any} color="#666" size={32} />
            <Text
              style={{
                color: "#999",
                fontSize: 16,
                fontFamily: "Poppins-Medium",
                marginTop: 12,
                marginBottom: 8,
              }}
            >
              No {addressType} address saved
            </Text>
            <Text
              style={{
                color: "#777",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Add your {addressType} address to continue
            </Text>
            <TouchableOpacity
              onPress={onAdd}
              style={{
                backgroundColor: "#007AFF",
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 24,
                width: "100%",
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
                Add {addressType} Address
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const AddressCard = ({
    name,
    address,
    phone,
    onEdit,
    onDelete,
  }: {
    name: string;
    address: string;
    phone: string;
    onEdit: () => void;
    onDelete: () => void;
  }) => (
    <View
      style={{
        backgroundColor: "#444",
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(0, 122, 255, 0.3)",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 14,
          fontFamily: "Poppins-Regular",
          marginBottom: 4,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          color: "#999",
          fontSize: 14,
          fontFamily: "Poppins-Regular",
          marginBottom: 4,
        }}
      >
        {address}
      </Text>
      {phone && (
        <Text
          style={{
            color: "#999",
            fontSize: 14,
            fontFamily: "Poppins-Regular",
            marginBottom: 16,
          }}
        >
          {phone}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={onEdit}
          style={{
            marginRight: 8,
            padding: 8,
          }}
        >
          <Feather name="edit" color="#007AFF" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          style={{
            padding: 8,
          }}
        >
          <Feather name="trash-2" color="#ff4444" size={20} />
        </TouchableOpacity>
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
            Addresses
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
            Addresses
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
            Error loading addresses
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
            onPress={loadAddresses}
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
          Addresses
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {/* Shipping Address Section */}
          <AddressSection
            title="Shipping Address"
            subtitle="Where your orders will be delivered"
            icon="truck"
            address={shippingAddress}
            addressType="shipping"
            onAdd={() => addAddress("shipping")}
            onEdit={() => editAddress("shipping")}
            onDelete={() => deleteAddress("shipping")}
          />

          {/* Billing Address Section */}
          <AddressSection
            title="Billing Address"
            subtitle="Address for payment and invoices"
            icon="credit-card"
            address={billingAddress}
            addressType="billing"
            onAdd={() => addAddress("billing")}
            onEdit={() => editAddress("billing")}
            onDelete={() => deleteAddress("billing")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
