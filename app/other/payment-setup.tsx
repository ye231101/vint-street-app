import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SellerSettings {
  storeName: string;
  email: string;
  phone: string;
  address: {
    fullAddress: string;
  };
  payment: {
    paypal: {
      email: string;
    };
    bank: {
      acName: string;
      acType: string;
      acNumber: string;
      bankName: string;
      bankAddr: string;
      routingNumber: string;
      iban: string;
      swift: string;
    };
  };
}

export default function PaymentSetupScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sellerSettings, setSellerSettings] = useState<SellerSettings | null>(
    null
  );

  // Form state
  const [paypalEmail, setPaypalEmail] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");

  useEffect(() => {
    loadSellerSettings();
  }, []);

  const loadSellerSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace with actual data fetching
      const mockSettings: SellerSettings = {
        storeName: "My Store",
        email: "store@example.com",
        phone: "+1234567890",
        address: {
          fullAddress: "123 Main St, City, State 12345",
        },
        payment: {
          paypal: {
            email: "paypal@example.com",
          },
          bank: {
            acName: "John Doe",
            acType: "Checking",
            acNumber: "1234567890",
            bankName: "Example Bank",
            bankAddr: "123 Bank St, City, State",
            routingNumber: "123456789",
            iban: "GB29NWBK60161331926819",
            swift: "NWBKGB2L",
          },
        },
      };

      setSellerSettings(mockSettings);

      // Populate form with existing data
      setPaypalEmail(mockSettings.payment.paypal.email);
      setAccountName(mockSettings.payment.bank.acName);
      setAccountType(mockSettings.payment.bank.acType);
      setAccountNumber(mockSettings.payment.bank.acNumber);
      setBankName(mockSettings.payment.bank.bankName);
      setBankAddress(mockSettings.payment.bank.bankAddr);
      setRoutingNumber(mockSettings.payment.bank.routingNumber);
      setIban(mockSettings.payment.bank.iban);
      setSwift(mockSettings.payment.bank.swift);
    } catch (err) {
      setError("Error loading payment settings");
    } finally {
      setIsLoading(false);
    }
  };

  const savePaymentSettings = async () => {
    if (!sellerSettings) return;

    setIsSaving(true);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update seller settings with new payment data
      const updatedSettings: SellerSettings = {
        ...sellerSettings,
        payment: {
          paypal: {
            email: paypalEmail.trim(),
          },
          bank: {
            acName: accountName.trim(),
            acType: accountType.trim(),
            acNumber: accountNumber.trim(),
            bankName: bankName.trim(),
            bankAddr: bankAddress.trim(),
            routingNumber: routingNumber.trim(),
            iban: iban.trim(),
            swift: swift.trim(),
          },
        },
      };

      setSellerSettings(updatedSettings);
      Alert.alert("Success", "Payment settings updated successfully");
    } catch (err) {
      Alert.alert("Error", "Failed to update payment settings");
    } finally {
      setIsSaving(false);
    }
  };

  const FormField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    multiline = false,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: "default" | "email-address" | "numeric";
    multiline?: boolean;
  }) => (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          fontFamily: "Poppins-Bold",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={{
          backgroundColor: "#555",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12,
          color: "#fff",
          fontSize: 16,
          fontFamily: "Poppins-Regular",
          minHeight: multiline ? 80 : 48,
          textAlignVertical: multiline ? "top" : "center",
        }}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );

  const SummaryItem = ({
    label,
    value,
    isHighlighted = false,
  }: {
    label: string;
    value: string;
    isHighlighted?: boolean;
  }) => (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 16,
      }}
    >
      <View style={{ flex: 2 }}>
        <Text
          style={{
            color: "#999",
            fontSize: 14,
            fontFamily: "Poppins-Regular",
          }}
        >
          {label}
        </Text>
      </View>
      <View style={{ flex: 3, alignItems: "flex-end" }}>
        <Text
          style={{
            color: "#fff",
            fontSize: isHighlighted ? 16 : 14,
            fontFamily: isHighlighted ? "Poppins-Bold" : "Poppins-Regular",
            textAlign: "right",
          }}
        >
          {value}
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
            Payment Setup
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
            Payment Setup
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
            Error loading payment settings
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
            onPress={loadSellerSettings}
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
          Payment Setup
        </Text>

        {!isLoading && sellerSettings && (
          <TouchableOpacity
            onPress={savePaymentSettings}
            disabled={isSaving}
            style={{
              backgroundColor: isSaving ? "#555" : "#007AFF",
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                }}
              >
                Save
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {/* PayPal Section */}
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontFamily: "Poppins-Bold",
              marginBottom: 16,
            }}
          >
            PayPal Account
          </Text>

          <View
            style={{
              backgroundColor: "#333",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <FormField
              label="PayPal Email Address"
              value={paypalEmail}
              onChangeText={setPaypalEmail}
              placeholder="Enter PayPal email address"
              keyboardType="email-address"
            />
          </View>

          {/* Bank Account Section */}
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontFamily: "Poppins-Bold",
              marginBottom: 16,
            }}
          >
            Bank Account
          </Text>

          <View
            style={{
              backgroundColor: "#333",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <FormField
              label="Account Name"
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Account holder name"
            />

            <FormField
              label="Account Type"
              value={accountType}
              onChangeText={setAccountType}
              placeholder="e.g., Checking, Savings"
            />

            <FormField
              label="Account Number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Bank account number"
              keyboardType="numeric"
            />

            <FormField
              label="Bank Name"
              value={bankName}
              onChangeText={setBankName}
              placeholder="Name of your bank"
            />

            <FormField
              label="Bank Address"
              value={bankAddress}
              onChangeText={setBankAddress}
              placeholder="Bank branch address"
              multiline
            />

            <FormField
              label="Routing Number"
              value={routingNumber}
              onChangeText={setRoutingNumber}
              placeholder="Bank routing number"
              keyboardType="numeric"
            />

            <FormField
              label="IBAN"
              value={iban}
              onChangeText={setIban}
              placeholder="International Bank Account Number"
            />

            <FormField
              label="SWIFT Code"
              value={swift}
              onChangeText={setSwift}
              placeholder="Bank SWIFT/BIC code"
            />
          </View>

          {/* Store Information */}
          {sellerSettings && (
            <>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontFamily: "Poppins-Bold",
                  marginBottom: 16,
                }}
              >
                Store Information
              </Text>

              <View
                style={{
                  backgroundColor: "#333",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <SummaryItem
                  label="Store Name"
                  value={sellerSettings.storeName}
                  isHighlighted
                />

                <SummaryItem label="Email" value={sellerSettings.email} />

                <SummaryItem
                  label="Phone"
                  value={sellerSettings.phone || "Not provided"}
                />

                <SummaryItem
                  label="Address"
                  value={sellerSettings.address.fullAddress || "Not provided"}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
