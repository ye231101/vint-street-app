import { useAuth } from "@/providers/auth-provider";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", marginBottom: 16 }}>
          Account
        </Text>
        
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontFamily: "Poppins-SemiBold", marginBottom: 8 }}>
            Welcome, {user?.firstName || user?.username}!
          </Text>
          <Text style={{ fontSize: 14, fontFamily: "Poppins-Regular", color: "#666" }}>
            {user?.email}
          </Text>
        </View>

        <Pressable
          onPress={handleLogout}
          style={{
            backgroundColor: "#ff4444",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontFamily: "Poppins-SemiBold" }}>
            Logout
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
