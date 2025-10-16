import { useAuth } from "@/providers/auth-provider";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IndexScreen() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);

  const onSubmit = async () => {
    await login(username, password);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View style={{ width: "100%", maxWidth: 520 }}>
            <View style={{ paddingBottom: 40, alignItems: "center" }}>
              <Image
                source={require("@/assets/images/splash_logo.png")}
                style={{ width: 160, height: 160, resizeMode: "contain" }}
              />
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Poppins-Bold",
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                Welcome to Vint Street
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins-Regular",
                  color: "#8e8e8e",
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Sign in to continue
              </Text>
            </View>

            {Boolean(error) && (
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
                <Text
                  style={{ fontFamily: "Poppins-Regular", color: "#b00020" }}
                >
                  {error}
                </Text>
              </View>
            )}

            <View style={{ width: "100%", marginTop: 0 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: "#e0e0e0",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  height: 52,
                }}
              >
                <Text style={{ marginRight: 8 }}>
                  <Feather name="user" size={24} color="black" />
                </Text>
                <TextInput
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    flex: 1,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    height: 52,
                    textAlignVertical: "center",
                  }}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={{ width: "100%", marginTop: 16 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: "#e0e0e0",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  height: 52,
                }}
              >
                <Text style={{ marginRight: 8 }}>
                  <Feather name="lock" size={24} color="black" />
                </Text>
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secure}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ 
                    flex: 1, 
                    fontFamily: "Poppins-Regular", 
                    fontSize: 16,
                    height: 52,
                    textAlignVertical: "center",
                  }}
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                />
                <Pressable onPress={() => setSecure((s) => !s)} hitSlop={8}>
                  <Text style={{ fontSize: 16, fontFamily: "Poppins-Regular" }}>
                    {secure ? (
                      <Feather name="eye" size={24} color="black" />
                    ) : (
                      <Feather name="eye-off" size={24} color="black" />
                    )}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={{ alignItems: "flex-end", marginTop: 16 }}>
              <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
                <Text style={{ fontFamily: "Poppins-Regular", color: "#222" }}>
                  Forgot Password?
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={onSubmit}
              disabled={loading}
              style={{
                height: 50,
                borderRadius: 8,
                backgroundColor: loading ? "#9e9e9e" : "#000",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 24,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  color: "#fff",
                  fontSize: 16,
                }}
              >
                {loading ? "..." : "Login"}
              </Text>
            </Pressable>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 24,
              }}
            >
              <Text style={{ fontFamily: "Poppins-Regular" }}>
                Don't have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/(auth)/register")}>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    color: "#222",
                    fontWeight: "500",
                  }}
                >
                  Register
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
