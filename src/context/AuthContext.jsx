import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import BASE_URL from "../constants/api";
import {WEB_CLIENT_ID} from '@env';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Configure Google Sign-In with only the required webClientId
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });

    (async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const user = await AsyncStorage.getItem("userInfo");
        if (token) {
          setUserToken(token);
          setUserInfo(user ? JSON.parse(user) : null);
        }
      } catch (err) {
        // console.error("Error reading storage:", err);
      } finally {
        setIsLoading(false);
        
      }
    })();
  }, []);

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
        return { success: false, error: "Please use your college email address to sign in." };
      }

      if (!res.ok) {
        const text = await res.text();
        return { success: false, error: "Authentication failed. Please try again." };
      }

      const data = await res.json();

      await AsyncStorage.setItem("userToken", data.access_token);
      setUserToken(data.access_token);
      setAuthError(null); 
      // console.log("✅ Auth successful:", data.user?.email);
      return { success: true };
    } catch (err) {
      const userFriendlyError = "Unable to complete sign in. Please try again.";
      // console.error("Authentication error:", err.message);
      setAuthError(userFriendlyError);
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
      setUserToken(null);
      setUserInfo(null);
      return { success: false, error: userFriendlyError };
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // console.log("✅ Play Services available");

      await GoogleSignin.signOut();
      
      await GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        forceCodeForRefreshToken: true,
        offlineAccess: false
      });

      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo || !userInfo.data || !userInfo.data.idToken) {
        return { success: false, error: "Sign-in was cancelled" };
      }
      
      return await handleGoogleResponse(userInfo.data.idToken);

    } catch (error) {
      // console.error("googleSignIn error:", JSON.stringify(error, null, 2));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.revokeAccess();
      
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
      
      setUserToken(null);
      setUserInfo(null);
      setAuthError(null);
      
      await GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        forceCodeForRefreshToken: true,
        offlineAccess: false
      });
    } catch (err) {
      // console.error("Logout error:", err);
      setUserToken(null);
      setUserInfo(null);
      setAuthError(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ userToken, userInfo, isLoading, googleSignIn, logout, authError, setAuthError }}
    >
      {children}
    </AuthContext.Provider>
  );
};
