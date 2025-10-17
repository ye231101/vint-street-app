import { useAuth } from "@/providers/auth-provider";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  shopName: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
  phone: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  shopName?: string;
  address1?: string;
  city?: string;
  postcode?: string;
  country?: string;
  phone?: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    shopName: "",
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    country: "",
    state: "",
    phone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [obscurePassword, setObscurePassword] = useState(true);
  const [obscureConfirmPassword, setObscureConfirmPassword] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateUsername = (username: string): string | undefined => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.includes(" ")) return "Username cannot contain spaces";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return undefined;
  };

  const validateConfirmPassword = (
    confirmPassword: string
  ): string | undefined => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== formData.password) return "Passwords do not match";
    return undefined;
  };

  const validateRequired = (
    value: string,
    fieldName: string
  ): string | undefined => {
    if (!value) return `${fieldName} is required`;
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    newErrors.username = validateUsername(formData.username);
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(
      formData.confirmPassword
    );
    newErrors.firstName = validateRequired(formData.firstName, "First Name");
    newErrors.lastName = validateRequired(formData.lastName, "Last Name");
    newErrors.shopName = validateRequired(formData.shopName, "Shop Name");
    newErrors.address1 = validateRequired(formData.address1, "Address Line 1");
    newErrors.city = validateRequired(formData.city, "City / Town");
    newErrors.postcode = validateRequired(formData.postcode, "Post/ZIP Code");
    newErrors.country = validateRequired(formData.country, "Country");
    newErrors.phone = validateRequired(formData.phone, "Phone Number");

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      Alert.alert("Terms Required", "You must accept the terms and conditions");
      return;
    }

    if (validateForm()) {
      const result = await register(
        formData.username,
        formData.email,
        formData.password,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          shopName: formData.shopName,
          address1: formData.address1,
          address2: formData.address2,
          city: formData.city,
          postcode: formData.postcode,
          country: formData.country,
          state: formData.state,
          phone: formData.phone,
          termsAccepted: termsAccepted,
        }
      );

      // If registration requires email verification, navigate to check-email screen
      if (result?.requiresVerification) {
        router.replace({
          pathname: "/(auth)/check-email",
          params: { 
            email: formData.email,
            password: formData.password, // Pass password so we can auto-login after confirmation
          },
        });
      } else if (error) {
        Alert.alert("Registration Failed", error);
      }
    }
  };

  const openTermsAndConditions = async () => {
    try {
      await WebBrowser.openBrowserAsync(
        "https://vintstreet.com/terms-and-conditions/"
      );
    } catch (error) {
      Alert.alert("Error", "Could not open terms and conditions");
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    error,
    secureTextEntry,
    keyboardType = "default",
    autoCapitalize = "sentences",
    showPasswordToggle = false,
    onTogglePassword,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    icon: string;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "phone-pad";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    showPasswordToggle?: boolean;
    onTogglePassword?: () => void;
  }) => (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 8,
          borderColor: error ? "#ff6b6b" : "#e0e0e0",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          height: 52,
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ marginRight: 8 }}>
          <Feather name={icon as any} size={24} color="black" />
        </Text>
         <TextInput
           placeholder={placeholder}
           value={value}
           onChangeText={onChangeText}
           secureTextEntry={secureTextEntry}
           autoCapitalize={autoCapitalize}
           autoCorrect={false}
           keyboardType={keyboardType}
           style={{
             flex: 1,
             fontFamily: "Poppins-Regular",
             fontSize: 16,
             height: 52,
             textAlignVertical: "center",
           }}
         />
        {showPasswordToggle && (
          <Pressable onPress={onTogglePassword} hitSlop={8}>
            <Feather
              name={secureTextEntry ? "eye" : "eye-off"}
              size={24}
              color="black"
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text
          style={{
            color: "#ff6b6b",
            fontSize: 12,
            marginTop: 4,
            fontFamily: "Poppins-Regular",
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Feather name="arrow-left" size={24} color="black" />
            </Pressable>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Poppins-Bold",
                flex: 1,
                textAlign: "center",
                marginRight: 24, // Offset for the back button
              }}
            >
              Create Account
            </Text>
          </View>

          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 30 }}>
            <Image
              source={require("@/assets/images/splash_logo.png")}
              style={{ width: 160, height: 160, resizeMode: "contain" }}
            />
          </View>

          {/* Error message */}
          {error && (
            <View
              style={{
                backgroundColor: "#ffe5e5",
                borderColor: "#ff9c9c",
                borderWidth: 1,
                padding: 10,
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <Text style={{ fontFamily: "Poppins-Regular", color: "#b00020" }}>
                {error}
              </Text>
            </View>
          )}

          <View style={{ width: "100%", maxWidth: 520, alignSelf: "center" }}>
            {/* Account Information Section */}
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins-Bold",
                marginBottom: 8,
                marginTop: 8,
              }}
            >
              Account Information
            </Text>

            <InputField
              label="Username"
              value={formData.username}
              onChangeText={(text) => updateFormData("username", text)}
              placeholder="Username"
              icon="user"
              error={errors.username}
              autoCapitalize="none"
            />

            <InputField
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateFormData("email", text)}
              placeholder="Email"
              icon="mail"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              label="Password"
              value={formData.password}
              onChangeText={(text) => updateFormData("password", text)}
              placeholder="Password"
              icon="lock"
              error={errors.password}
              secureTextEntry={obscurePassword}
              autoCapitalize="none"
              showPasswordToggle={true}
              onTogglePassword={() => setObscurePassword(!obscurePassword)}
            />

            <InputField
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData("confirmPassword", text)}
              placeholder="Confirm Password"
              icon="lock"
              error={errors.confirmPassword}
              secureTextEntry={obscureConfirmPassword}
              autoCapitalize="none"
              showPasswordToggle={true}
              onTogglePassword={() =>
                setObscureConfirmPassword(!obscureConfirmPassword)
              }
            />

            {/* Personal Information Section */}
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins-Bold",
                marginBottom: 8,
                marginTop: 8,
              }}
            >
              Personal Information
            </Text>

            <InputField
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => updateFormData("firstName", text)}
              placeholder="First Name"
              icon="user"
              error={errors.firstName}
            />

            <InputField
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => updateFormData("lastName", text)}
              placeholder="Last Name"
              icon="user"
              error={errors.lastName}
            />

            <InputField
              label="Shop Name"
              value={formData.shopName}
              onChangeText={(text) => updateFormData("shopName", text)}
              placeholder="Shop Name"
              icon="shopping-bag"
              error={errors.shopName}
            />

            {/* Address Information Section */}
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins-Bold",
                marginBottom: 8,
                marginTop: 8,
              }}
            >
              Address Information
            </Text>

            <InputField
              label="Address Line 1"
              value={formData.address1}
              onChangeText={(text) => updateFormData("address1", text)}
              placeholder="Address Line 1"
              icon="home"
              error={errors.address1}
            />

            <InputField
              label="Address Line 2"
              value={formData.address2}
              onChangeText={(text) => updateFormData("address2", text)}
              placeholder="Address Line 2"
              icon="home"
            />

            <InputField
              label="City / Town"
              value={formData.city}
              onChangeText={(text) => updateFormData("city", text)}
              placeholder="City / Town"
              icon="map-pin"
              error={errors.city}
            />

            <InputField
              label="Post/ZIP Code"
              value={formData.postcode}
              onChangeText={(text) => updateFormData("postcode", text)}
              placeholder="Post/ZIP Code"
              icon="mail"
              error={errors.postcode}
            />

            <InputField
              label="Country"
              value={formData.country}
              onChangeText={(text) => updateFormData("country", text)}
              placeholder="Country"
              icon="globe"
              error={errors.country}
            />

            <InputField
              label="State/County"
              value={formData.state}
              onChangeText={(text) => updateFormData("state", text)}
              placeholder="State/County"
              icon="map"
            />

            <InputField
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => updateFormData("phone", text)}
              placeholder="Phone Number"
              icon="phone"
              error={errors.phone}
              keyboardType="phone-pad"
            />

            {/* Terms and Conditions */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 24,
                marginBottom: 24,
              }}
            >
              <Pressable
                onPress={() => setTermsAccepted(!termsAccepted)}
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  borderRadius: 4,
                  marginRight: 12,
                  marginTop: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: termsAccepted ? "#000" : "#fff",
                }}
              >
                {termsAccepted && (
                  <Feather name="check" size={16} color="white" />
                )}
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Poppins-Regular", lineHeight: 20 }}>
                  I have read and agree to the{" "}
                  <Text
                    style={{
                      color: "#007AFF",
                      textDecorationLine: "underline",
                    }}
                    onPress={openTermsAndConditions}
                  >
                    Terms and Conditions
                  </Text>
                </Text>
              </View>
            </View>

            {/* Create Account Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={{
                height: 50,
                borderRadius: 8,
                backgroundColor: loading ? "#9e9e9e" : "#000",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  color: "#fff",
                  fontSize: 16,
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </Pressable>

            {/* Login Link */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "Poppins-Regular" }}>
                Already have an account?{" "}
              </Text>
              <Pressable onPress={() => router.back()}>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    color: "#222",
                    fontWeight: "500",
                  }}
                >
                  Login
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
