import { useAuth } from "@/providers/auth-provider";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return undefined;
  };

  const handleResetPassword = async () => {
    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    setEmailError(undefined);
    await resetPassword(email);

    if (error) {
      Alert.alert("Reset Failed", error);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError(undefined);
    }
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: "100%", maxWidth: 520, alignItems: "center" }}>
              {/* Success Icon */}
              <View style={{ marginBottom: 24 }}>
                <Feather name="check-circle" size={80} color="#4CAF50" />
              </View>

              {/* Success Title */}
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Poppins-Bold",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                Password Reset Email Sent
              </Text>

              {/* Success Message */}
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins-Regular",
                  textAlign: "center",
                  color: "#666",
                  lineHeight: 24,
                  marginBottom: 32,
                }}
              >
                If this email is registered, you will receive a password reset link shortly. Please check your inbox and spam folder.
              </Text>

              {/* Return to Login Button */}
              <Pressable
                onPress={() => router.back()}
                style={{
                  height: 50,
                  borderRadius: 8,
                  backgroundColor: "#000",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    color: "#fff",
                    fontSize: 16,
                  }}
                >
                  Return to Login
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            marginBottom: 20,
            width: "100%",
            paddingTop: 10,
          }}>
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
              Forgot Password
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: "100%", maxWidth: 520, alignItems: "center" }}>
              {/* Logo */}
              <View style={{ alignItems: "center", marginBottom: 30 }}>
                <Image
                  source={require("@/assets/images/splash_logo.png")}
                  style={{ width: 160, height: 160, resizeMode: "contain" }}
                />
              </View>

              {/* Title */}
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Poppins-Bold",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                Forgot your password?
              </Text>

            {/* Description */}
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-Regular",
                textAlign: "center",
                color: "#666",
                lineHeight: 24,
                marginBottom: 32,
              }}
            >
              Enter your email address and we'll send you instructions to reset your password.
            </Text>

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
                  width: "100%",
                }}
              >
                <Text
                  style={{ fontFamily: "Poppins-Regular", color: "#b00020" }}
                >
                  {error}
                </Text>
              </View>
            )}

            {/* Email Input Field */}
            <View style={{ width: "100%", marginBottom: 24 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: emailError ? "#ff6b6b" : "#e0e0e0",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  height: 52,
                  backgroundColor: "#fff",
                }}
              >
                <Text style={{ marginRight: 8 }}>
                  <Feather name="mail" size={24} color="black" />
                </Text>
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    flex: 1,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    height: 52,
                    textAlignVertical: "center",
                  }}
                />
              </View>
              {emailError && (
                <Text style={{ 
                  color: "#ff6b6b", 
                  fontSize: 12, 
                  marginTop: 4,
                  fontFamily: "Poppins-Regular",
                }}>
                  {emailError}
                </Text>
              )}
            </View>

              {/* Reset Password Button */}
              <Pressable
                onPress={handleResetPassword}
                disabled={loading}
                style={{
                  height: 50,
                  borderRadius: 8,
                  backgroundColor: loading ? "#9e9e9e" : "#000",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    color: "#fff",
                    fontSize: 16,
                  }}
                >
                  {loading ? "Sending..." : "Reset Password"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
