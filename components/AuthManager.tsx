import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  initializeAuth,
  handleAuthStateChange,
} from "@/store/slices/authSlice";
import { authService } from "@/api";
import { removeSecureValue, setSecureValue } from "@/utils/storage";
import { router } from "expo-router";
import { useEffect } from "react";

const KEY_TOKEN = "TOKEN";
const KEY_USER_DATA = "USER_DATA";

export function AuthManager() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  // Initialize authentication on mount
  useEffect(() => {
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
            await setSecureValue(KEY_TOKEN, session.access_token);
            await setSecureValue(KEY_USER_DATA, JSON.stringify(currentUser));

            // Auto-redirect to main app after email confirmation
            router.replace("/(tabs)");
          }
        } else if (event === "SIGNED_OUT") {
          await removeSecureValue(KEY_TOKEN);
          await removeSecureValue(KEY_USER_DATA);
          router.replace("/(auth)");
        } else if (event === "USER_UPDATED" && session) {
          // Handle email confirmation
          const { user: currentUser } = await authService.getCurrentUser();
          if (currentUser) {
            await setSecureValue(KEY_TOKEN, session.access_token);
            await setSecureValue(KEY_USER_DATA, JSON.stringify(currentUser));
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

  // This component doesn't render anything, it just manages auth state
  return null;
}
