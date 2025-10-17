import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PaymentMethod {
  id: string;
  cardType: string;
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savePaymentInfo, setSavePaymentInfo] = useState(true);
  const [quickCheckout, setQuickCheckout] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual data fetching
      setPaymentMethods([]);
    } catch (err) {
      setError("Error loading payment methods");
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = () => {
    Alert.alert("Add Payment Method", "This would open the payment method form");
  };

  const setDefaultPaymentMethod = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          isDefault: method.id === id
        }))
      );
      
      Alert.alert("Success", "Default payment method updated");
    } catch (err) {
      Alert.alert("Error", "Failed to update default payment method");
    }
  };

  const deletePaymentMethod = (id: string) => {
    Alert.alert(
      "Delete Payment Method",
      "Are you sure you want to delete this payment method?",
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
              await new Promise(resolve => setTimeout(resolve, 500));
              
              setPaymentMethods(prev => prev.filter(method => method.id !== id));
              Alert.alert("Success", "Payment method deleted");
            } catch (err) {
              Alert.alert("Error", "Failed to delete payment method");
            }
          },
        },
      ]
    );
  };

  const SavedCard = ({
    cardType,
    lastFour,
    expiryDate,
    isDefault,
    onSetDefault,
    onDelete,
  }: {
    cardType: string;
    lastFour: string;
    expiryDate: string;
    isDefault: boolean;
    onSetDefault: () => void;
    onDelete: () => void;
  }) => (
    <View
      style={{
        backgroundColor: "#333",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Feather name="credit-card" color="#fff" size={24} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
              marginBottom: 4,
            }}
          >
            {cardType} •••• {lastFour}
          </Text>
          <Text
            style={{
              color: "#999",
              fontSize: 14,
              fontFamily: "Poppins-Regular",
            }}
          >
            Expires {expiryDate}
          </Text>
        </View>
        {isDefault && (
          <View
            style={{
              backgroundColor: "rgba(0, 122, 255, 0.2)",
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: "#007AFF",
                fontSize: 12,
                fontFamily: "Poppins-Bold",
              }}
            >
              Default
            </Text>
          </View>
        )}
      </View>
      
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        {!isDefault && (
          <TouchableOpacity
            onPress={onSetDefault}
            style={{
              marginRight: 16,
              paddingVertical: 8,
            }}
          >
            <Text
              style={{
                color: "#007AFF",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
              }}
            >
              Set as Default
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onDelete}
          style={{
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              color: "#ff4444",
              fontSize: 14,
              fontFamily: "Poppins-Regular",
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const SettingsItem = ({
    icon,
    title,
    subtitle,
    value,
    onValueChange,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
      }}
    >
      <Feather name={icon as any} color="#fff" size={24} />
      <View style={{ marginLeft: 16, flex: 1 }}>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
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
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#333", true: "#007AFF" }}
        thumbColor={value ? "#fff" : "#999"}
      />
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
            Payment Methods
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
            Payment Methods
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
            Error loading payment methods
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
            onPress={loadPaymentMethods}
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
          Payment Methods
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {/* Add New Payment Method */}
          <View
            style={{
              backgroundColor: "#333",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                color: "#999",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                marginBottom: 16,
              }}
            >
              Add a new payment method
            </Text>
            <TouchableOpacity
              onPress={addPaymentMethod}
              style={{
                backgroundColor: "#007AFF",
                borderRadius: 8,
                paddingVertical: 12,
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
                Add Payment Method
              </Text>
            </TouchableOpacity>
          </View>

          {/* Saved Cards Section */}
          {paymentMethods.length > 0 ? (
            <>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontFamily: "Poppins-Bold",
                  marginBottom: 16,
                }}
              >
                Saved Cards
              </Text>

              {paymentMethods.map((method) => (
                <SavedCard
                  key={method.id}
                  cardType={method.cardType}
                  lastFour={method.lastFour}
                  expiryDate={method.expiryDate}
                  isDefault={method.isDefault}
                  onSetDefault={() => setDefaultPaymentMethod(method.id)}
                  onDelete={() => deletePaymentMethod(method.id)}
                />
              ))}
            </>
          ) : (
            <View
              style={{
                backgroundColor: "#333",
                borderRadius: 12,
                padding: 20,
                borderWidth: 1,
                borderColor: "#555",
                borderStyle: "solid",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Feather name="credit-card" color="#666" size={32} />
              <Text
                style={{
                  color: "#999",
                  fontSize: 16,
                  fontFamily: "Poppins-Medium",
                  marginTop: 12,
                  marginBottom: 8,
                }}
              >
                No payment methods saved
              </Text>
              <Text
                style={{
                  color: "#777",
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  textAlign: "center",
                }}
              >
                Add a payment method to continue
              </Text>
            </View>
          )}

          {/* Payment Settings */}
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontFamily: "Poppins-Bold",
              marginBottom: 16,
            }}
          >
            Payment Settings
          </Text>
          
          <View
            style={{
              backgroundColor: "#333",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <SettingsItem
              icon="lock"
              title="Save Payment Info"
              subtitle="Securely save cards for faster checkout"
              value={savePaymentInfo}
              onValueChange={setSavePaymentInfo}
            />
            
            <View
              style={{
                height: 1,
                backgroundColor: "#555",
                marginVertical: 16,
              }}
            />
            
            <SettingsItem
              icon="credit-card"
              title="Quick Checkout"
              subtitle="Use default card for faster purchases"
              value={quickCheckout}
              onValueChange={setQuickCheckout}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
