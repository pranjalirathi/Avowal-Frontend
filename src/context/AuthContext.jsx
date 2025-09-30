import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import BASE_URL from "../constants/api";
import { WEB_CLIENT_ID } from '@env';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Configure Google Sign-In ONCE on mount
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const user = await AsyncStorage.getItem("userInfo");
      
      if (token) {
        setUserToken(token);
        setUserInfo(user ? JSON.parse(user) : null);
      }
    } catch (err) {
      console.error("Error reading storage:", err);
      // Clear potentially corrupted data
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove(["userToken", "userInfo"]);
      setUserToken(null);
      setUserInfo(null);
      setAuthError(null);
    } catch (err) {
      console.error("Error clearing auth data:", err);
    }
  };

  const handleGoogleResponse = async (idToken) => {
    try {
      if (!idToken) {
        return { success: false, error: "Authentication was cancelled" };
      }

      setIsLoading(true);
      setAuthError(null);

      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      });

      if (res.status === 401) {
        await GoogleSignin.signOut();
        return { 
          success: false, 
          error: "Please use your college email address to sign in." 
        };
      }

      if (!res.ok) {
        const text = await res.text();
        console.error("Auth API error:", text);
        return { 
          success: false, 
          error: "Authentication failed. Please try again." 
        };
      }

      const data = await res.json();

      // Store both token and user info
      await AsyncStorage.multiSet([
        ["userToken", data.access_token],
        ["userInfo", JSON.stringify(data.user || {})]
      ]);

      setUserToken(data.access_token);
      setUserInfo(data.user || null);
      setAuthError(null);

      console.log("✅ Auth successful:", data.user?.email);
      return { success: true };

    } catch (err) {
      const userFriendlyError = "Unable to complete sign in. Please try again.";
      console.error("Authentication error:", err.message);
      setAuthError(userFriendlyError);
      await clearAuthData();
      return { success: false, error: userFriendlyError };
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = useCallback(async () => {
    try {
      // Check Play Services availability
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Sign out first to ensure clean state
      await GoogleSignin.signOut();

      // Sign in
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo?.data?.idToken) {
        return { success: false, error: "Sign-in was cancelled" };
      }

      return await handleGoogleResponse(userInfo.data.idToken);

    } catch (error) {
      console.error("googleSignIn error:", error);

      // Handle specific error cases
      if (error.code === 'SIGN_IN_CANCELLED') {
        return { success: false, error: "Sign-in was cancelled" };
      }
      
      if (error.code === 'IN_PROGRESS') {
        return { success: false, error: "Sign-in already in progress" };
      }

      if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        return { 
          success: false, 
          error: "Google Play Services not available. Please update Google Play Services." 
        };
      }

      return { 
        success: false, 
        error: "An unexpected error occurred. Please try again." 
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Sign out from Google (silently fail if not signed in)
      try {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          await GoogleSignin.signOut();
        }
      } catch (signOutError) {
        console.log("Google sign out error (non-critical):", signOutError);
      }

      // Try to revoke access (optional, might fail)
      try {
        await GoogleSignin.revokeAccess();
      } catch (revokeError) {
        console.log("Revoke access error (non-critical):", revokeError);
      }

      // Clear local storage and state (most important)
      await clearAuthData();

      console.log("✅ Logout successful");
      return { success: true };

    } catch (err) {
      console.error("Logout error:", err);
      // Even if there's an error, clear local state
      await clearAuthData();
      return { success: false, error: "Logout completed with errors" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ 
        userToken, 
        userInfo, 
        isLoading, 
        googleSignIn, 
        logout, 
        authError, 
        setAuthError 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};