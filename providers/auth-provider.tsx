import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

type User = {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  shopName?: string;
};

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
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    data: RegisterData
  ) => Promise<void>;
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
        const token = await getValueFor(KEY_TOKEN);
        setIsAuthenticated(!!token);

        if (token) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)");
        }
      } catch (e) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, [isAuthenticated]);

  const login = async (username: string, password: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      if (username.trim().length === 0 || password.trim().length < 6) {
        setError("Invalid username or password");
        return;
      }

      const mockUser: User = {
        id: "1",
        username,
        email: `${username}@example.com`,
      };
      await setValueFor(KEY_USER_DATA, JSON.stringify(mockUser));
      await setValueFor(KEY_TOKEN, "mock-token");
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (e) {
      setError("Login failed");
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
      const mockUser: User = {
        id: "1",
        username,
        email,
        firstName: data.firstName,
        lastName: data.lastName,
        shopName: data.shopName,
      };
      await setValueFor(KEY_USER_DATA, JSON.stringify(mockUser));
      await setValueFor(KEY_TOKEN, "mock-token");
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (e) {
      setError("Registration failed");
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
    } catch (e) {
      setError("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await removeValueFor(KEY_TOKEN);
      await removeValueFor(KEY_USER_DATA);
      setUser(null);
      setIsAuthenticated(false);
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
