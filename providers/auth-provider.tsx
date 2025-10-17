import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { authService } from "@/api";
import type { AuthUser } from "@/api";

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

async function setValueFor(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

async function removeValueFor(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}

async function getValueFor(key: string): Promise<string | null> {
  const result = await SecureStore.getItemAsync(key);
  return result;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        // Check for existing session with Supabase
        const { session, error } = await authService.getSession();
        
        if (session && !error) {
          const { user: currentUser } = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
            await setValueFor(KEY_TOKEN, session.access_token);
            await setValueFor(KEY_USER_DATA, JSON.stringify(currentUser));
            router.replace("/(tabs)");
          } else {
            setIsAuthenticated(false);
            router.replace("/(auth)");
          }
        } else {
          setIsAuthenticated(false);
          router.replace("/(auth)");
        }
      } catch (e) {
        setIsAuthenticated(false);
        router.replace("/(auth)");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();

    // Listen to auth state changes (handles email confirmation links)
    const { data: authListener } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'Session:', !!session);
        
        if (event === 'SIGNED_IN' && session) {
          const { user: currentUser } = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
            await setValueFor(KEY_TOKEN, session.access_token);
            await setValueFor(KEY_USER_DATA, JSON.stringify(currentUser));
            
            // Auto-redirect to main app after email confirmation
            router.replace("/(tabs)");
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          await removeValueFor(KEY_TOKEN);
          await removeValueFor(KEY_USER_DATA);
        } else if (event === 'USER_UPDATED' && session) {
          // Handle email confirmation
          const { user: currentUser } = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
            await setValueFor(KEY_TOKEN, session.access_token);
            await setValueFor(KEY_USER_DATA, JSON.stringify(currentUser));
          }
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      if (email.trim().length === 0 || password.trim().length < 6) {
        setError("Invalid email or password");
        return;
      }

      // Sign in with email and password using Supabase
      const { user: authUser, session, error: authError } = await authService.signIn({
        email,
        password,
      });

      if (authError || !authUser || !session) {
        setError(authError || "Login failed");
        return;
      }

      await setValueFor(KEY_USER_DATA, JSON.stringify(authUser));
      await setValueFor(KEY_TOKEN, session.access_token);
      setUser(authUser);
      setIsAuthenticated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    data: RegisterData
  ) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      if (
        username.trim().length < 3 ||
        email.trim().length === 0 ||
        password.trim().length < 6
      ) {
        setError("Invalid registration data");
        return;
      }

      const { user: authUser, session, error: authError } = await authService.signUp({
        email,
        password,
        username,
        full_name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        firstName: data.firstName,
        lastName: data.lastName,
        shopName: data.shopName,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        postcode: data.postcode,
        country: data.country,
        state: data.state,
        phone: data.phone,
        termsAccepted: data.termsAccepted,
      });

      if (authError || !authUser) {
        setError(authError || "Registration failed");
        return;
      }

      // Check if email confirmation is required (no session means confirmation needed)
      if (session) {
        // Auto-confirmed - sign in immediately
        await setValueFor(KEY_USER_DATA, JSON.stringify(authUser));
        await setValueFor(KEY_TOKEN, session.access_token);
        setUser(authUser);
        setIsAuthenticated(true);
        return { requiresVerification: false };
      } else {
        // Email confirmation required - redirect to OTP screen
        return { requiresVerification: true };
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    
    try {
      if (email.trim().length === 0) {
        setError("Email is required");
        return;
      }

      const { error: resetError, success } = await authService.resetPassword(email);

      if (resetError || !success) {
        setError(resetError || "Failed to send reset email");
        return;
      }

      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    
    try {
      // Sign out from Supabase (ends session on server)
      const { error: signOutError } = await authService.signOut();
      
      if (signOutError) {
        console.error("Supabase sign out error:", signOutError);
        setError(signOutError);
        // Continue with local cleanup even if server signout fails
      }

      // Clear local storage
      await removeValueFor(KEY_TOKEN);
      await removeValueFor(KEY_USER_DATA);
      
      // Clear auth state
      setUser(null);
      setIsAuthenticated(false);
      
      // Navigate to login screen
      router.replace("/(auth)");
    } catch (e) {
      console.error("Logout error:", e);
      setError(e instanceof Error ? e.message : "Logout failed");
      
      // Still clear local data even if there's an error
      await removeValueFor(KEY_TOKEN);
      await removeValueFor(KEY_USER_DATA);
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/(auth)");
    } finally {
      setLoading(false);
    }
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
