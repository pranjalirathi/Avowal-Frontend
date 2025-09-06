import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { WEB_CLIENT_ID } from "../config/GoogleConfig";

const BASE_URL = "https://avowal-backend.vercel.app"; // <--- set to your deployed backend URL

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        console.error("Error reading storage:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleGoogleResponse = async (idToken) => {
    try {
      setIsLoading(true);
      console.log("Sending id_token to backend:", idToken?.slice?.(0, 20), "...");

      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Backend auth failed: ${res.status} ${text}`);
      }

      const data = await res.json();

      await AsyncStorage.setItem("userToken", data.access_token);
      await AsyncStorage.setItem("userInfo", JSON.stringify(data.user));

      setUserToken(data.access_token);
      setUserInfo(data.user);

      console.log("✅ Auth successful:", data.user?.email);
    } catch (err) {
      console.error("Authentication error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      if (idToken) {
        handleGoogleResponse(idToken);
      }
    } catch (err) {
      console.error("googleSignIn error:", err);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
      setUserToken(null);
      setUserInfo(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ userToken, userInfo, isLoading, googleSignIn, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
