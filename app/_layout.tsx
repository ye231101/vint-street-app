import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/providers/auth-provider";
import { BasketProvider } from "@/providers/basket-provider";
import { RecentlyViewedProvider } from "@/providers/recently-viewed-provider";
import { ReduxProvider } from "@/providers/redux-provider";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  return (
    <ReduxProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <BasketProvider>
            <RecentlyViewedProvider>
              <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="product" options={{ headerShown: false }} />
                <Stack.Screen name="message" options={{ headerShown: false }} />
                <Stack.Screen name="other" options={{ headerShown: false }} />
                <Stack.Screen name="basket" options={{ headerShown: false }} />
                <Stack.Screen name="checkout" options={{ headerShown: false }} />
              </Stack>
            </RecentlyViewedProvider>
          </BasketProvider>
        </AuthProvider>
        <StatusBar style="auto" backgroundColor="black" />
      </ThemeProvider>
    </ReduxProvider>
  );
}
