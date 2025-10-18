import { Stack } from 'expo-router';
import React from 'react';

export default function OtherLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="seller-dashboard"
        options={{
          title: 'Seller Dashboard',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="payment-setup"
        options={{
          title: 'Payment Setup',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          title: 'My Orders',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="favourites"
        options={{
          title: 'Favourites',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="payment-methods"
        options={{
          title: 'Payment Methods',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="addresses"
        options={{
          title: 'Addresses',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="help-center"
        options={{
          title: 'Help Center',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="contact-support"
        options={{
          title: 'Contact Support',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="app-settings"
        options={{
          title: 'App Settings',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="privacy-security"
        options={{
          title: 'Privacy & Security',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
