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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initializeAuth, handleAuthStateChange } from "@/store/slices/authSlice";
import { authService } from "@/api";
import { getSecureValue, removeSecureValue, setSecureValue } from "@/utils/storage";
import { router } from "expo-router";
import { ReduxProvider } from "@/providers/redux-provider";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

// Auth handler component that manages authentication logic
function AuthHandler({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize authentication on app start
    dispatch(initializeAuth());

    // Listen to auth state changes (handles email confirmation links)
    const { data: authListener } = authService.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, "Session:", !!session);

        // Dispatch auth state change to Redux
        dispatch(handleAuthStateChange({ event, session }));

        if (event === "SIGNED_IN" && session) {
          const { user: currentUser } = await authService.getCurrentUser();
          if (currentUser) {
            await setSecureValue("TOKEN", session.access_token);
            await setSecureValue("USER_DATA", JSON.stringify(currentUser));

            // Auto-redirect to main app after email confirmation
            router.replace("/(tabs)");
          }
        } else if (event === "SIGNED_OUT") {
          await removeSecureValue("TOKEN");
          await removeSecureValue("USER_DATA");
          router.replace("/(auth)");
        } else if (event === "USER_UPDATED" && session) {
          // Handle email confirmation
          const { user: currentUser } = await authService.getCurrentUser();
          if (currentUser) {
            await setSecureValue("TOKEN", session.access_token);
            await setSecureValue("USER_DATA", JSON.stringify(currentUser));
          }
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)");
      }
    }
  }, [isAuthenticated, isInitialized]);

  return <>{children}</>;
}

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
        <AuthHandler>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="product" options={{ headerShown: false }} />
            <Stack.Screen name="message" options={{ headerShown: false }} />
            <Stack.Screen name="other" options={{ headerShown: false }} />
            <Stack.Screen name="basket" options={{ headerShown: false }} />
            <Stack.Screen name="checkout" options={{ headerShown: false }} />
          </Stack>
        </AuthHandler>
        <StatusBar style="auto" backgroundColor="black" />
      </ThemeProvider>
    </ReduxProvider>
  );
}
