import { router } from "expo-router";
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { authService } from "@/api";
import type { AuthUser } from "@/api";
import { setSecureValue, getSecureValue, removeSecureValue } from "@/utils/secure-storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initializeAuth, loginUser, registerUser, resetPassword as resetPasswordAction, logoutUser, handleAuthStateChange } from "@/store/slices/authSlice";

type User = AuthUser;

type RegisterData = {
  firstName?: string;
  lastName?: string;
  shopName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  state?: string;
  phone?: string;
  termsAccepted?: boolean;
};

type AuthContextProps = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error?: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    data: RegisterData
  ) => Promise<{ requiresVerification: boolean } | undefined>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const KEY_TOKEN = "TOKEN";
const KEY_USER_DATA = "USER_DATA";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading, error, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize authentication on app start
    dispatch(initializeAuth());

    // Listen to auth state changes (handles email confirmation links)
    const { data: authListener } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'Session:', !!session);
        
        // Dispatch auth state change to Redux
        dispatch(handleAuthStateChange({ event, session }));
        
        if (event === 'SIGNED_IN' && session) {
          const { user: currentUser } = await authService.getCurrentUser();
          if (currentUser) {
            await setSecureValue(KEY_TOKEN, session.access_token);
            await setSecureValue(KEY_USER_DATA, JSON.stringify(currentUser));
            
            // Auto-redirect to main app after email confirmation
            router.replace("/(tabs)");
          }
        } else if (event === 'SIGNED_OUT') {
          await removeSecureValue(KEY_TOKEN);
          await removeSecureValue(KEY_USER_DATA);
          router.replace("/(auth)");
        } else if (event === 'USER_UPDATED' && session) {
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

  const login = async (email: string, password: string) => {
    if (loading) return;
    dispatch(loginUser({ email, password }));
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    data: RegisterData
  ) => {
    if (loading) return;
    
    const result = await dispatch(registerUser({
      username,
      email,
      password,
      ...data
    }));
    
    if (registerUser.fulfilled.match(result)) {
      return { requiresVerification: result.payload.requiresVerification };
    }
    return undefined;
  };

  const resetPassword = async (email: string) => {
    if (loading) return;
    dispatch(resetPasswordAction(email));
  };

  const logout = async () => {
    if (loading) return;
    dispatch(logoutUser());
  };

  const value: AuthContextProps = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
