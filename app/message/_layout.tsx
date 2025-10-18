import { Stack } from 'expo-router';
import React from 'react';

export default function MessageLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Message Details',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
