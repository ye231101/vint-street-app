import { supabase } from "../config/supabase";
import {
  AuthResponse,
  PasswordResetResponse,
  ResendOTPResponse,
  SignInData,
  SignUpData,
  VerifyOTPData,
  VerifyOTPResponse,
  mapSupabaseUserToAuthUser,
} from "../types/auth.types";

/**
 * Auth Service
 * Handles all authentication operations with Supabase
 */
class AuthService {
  /**
   * Sign up a new user
   * @param data - User registration data
   * @returns AuthResponse with user, session, and error
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { email, password, username, full_name, ...additionalData } = data;

      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split("@")[0],
            full_name,
            ...additionalData,
          },
        },
      });

      if (error) {
        return {
          user: null,
          session: null,
          error: error.message,
        };
      }

      return {
        user: mapSupabaseUserToAuthUser(authData.user),
        session: authData.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : "Sign up failed",
      };
    }
  }

  /**
   * Sign in an existing user
   * @param data - User login credentials
   * @returns AuthResponse with user, session, and error
   */
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { email, password } = data;

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          user: null,
          session: null,
          error: error.message,
        };
      }

      return {
        user: mapSupabaseUserToAuthUser(authData.user),
        session: authData.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : "Sign in failed",
      };
    }
  }

  /**
   * Sign out the current user
   * @returns Error message if any
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Sign out failed",
      };
    }
  }

  /**
   * Reset password for a user
   * Sends a password reset email with a link to reset password
   * @param email - User email address
   * @returns PasswordResetResponse with success status
   */
  async resetPassword(email: string): Promise<PasswordResetResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return {
          error: error.message,
          success: false,
        };
      }

      return {
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Password reset failed",
        success: false,
      };
    }
  }

  /**
   * Get the current session
   * @returns Current session or null
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return { session: null, error: error.message };
      }

      return { session: data.session, error: null };
    } catch (error) {
      return {
        session: null,
        error: error instanceof Error ? error.message : "Failed to get session",
      };
    }
  }

  /**
   * Get the current user
   * @returns Current user or null
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        return { user: null, error: error.message };
      }

      return {
        user: mapSupabaseUserToAuthUser(data.user),
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : "Failed to get user",
      };
    }
  }

  /**
   * Verify OTP code sent to email
   * @param data - OTP verification data (email, token, type)
   * @returns VerifyOTPResponse
   */
  async verifyOTP(data: VerifyOTPData): Promise<VerifyOTPResponse> {
    try {
      const { email, token, type } = data;

      const { data: authData, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type,
      });

      if (error) {
        return {
          error: error.message,
          success: false,
          session: null,
          user: null,
        };
      }

      return {
        error: null,
        success: true,
        session: authData.session,
        user: mapSupabaseUserToAuthUser(authData.user),
      };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "OTP verification failed",
        success: false,
        session: null,
        user: null,
      };
    }
  }

  /**
   * Resend OTP code to email
   * @param email - User email address
   * @param type - Type of OTP (signup, email, etc.)
   * @returns ResendOTPResponse
   */
  async resendOTP(
    email: string,
    type: "signup" | "email" = "signup"
  ): Promise<ResendOTPResponse> {
    try {
      const { error } = await supabase.auth.resend({
        type,
        email,
      });

      if (error) {
        return {
          error: error.message,
          success: false,
        };
      }

      return {
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to resend OTP",
        success: false,
      };
    }
  }

  /**
   * Listen to auth state changes
   * @param callback - Callback function to handle auth state changes
   * @returns Subscription object
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
export default authService;
