import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SellScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 18, fontFamily: "Poppins-Bold" }}>
          Sell Screen
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Poppins-Regular", marginTop: 8 }}>
          Coming Soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
