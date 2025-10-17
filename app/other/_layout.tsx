import { Stack } from "expo-router";
import React from "react";

export default function OtherLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "card",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="privacy-security"
        options={{
          title: "Privacy & Security",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
