import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginUser,
  registerUser,
  logoutUser,
  resetPassword as resetPasswordAction,
} from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading, error, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  const login = async (email: string, password: string) => {
    if (loading) return;
    dispatch(loginUser({ email, password }));
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      dateOfBirth?: string;
      gender?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
      };
    }
  ) => {
    if (loading) return;

    const result = await dispatch(
      registerUser({
        username,
        email,
        password,
        ...data,
      })
    );

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

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    resetPassword,
    logout,
  };
};
