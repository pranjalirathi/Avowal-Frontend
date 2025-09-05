import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { WEB_CLIENT_ID } from "../config/GoogleConfig";

WebBrowser.maybeCompleteAuthSession();

const BASE_URL = "https://avowal.vercel.app"; // <--- set to your deployed backend URL

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use Expo proxy for development: Google will accept the proxy redirect URI
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  console.log("🔗 Auth redirectUri (useProxy=true):", redirectUri);

  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: WEB_CLIENT_ID, // must be the Web client ID in Google Console
      redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: "id_token",
      extraParams: { nonce: "nonce" }, // required for id_token
    },
    discovery
  );

  console.log(">>> makeRedirectUri:", redirectUri);
console.log(">>> request.url:", request?.url);

  useEffect(() => {
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

  // When Google returns, send the id_token to backend
  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.params?.id_token || response.params?.idToken;
      if (idToken) {
        handleGoogleResponse(idToken);
      } else {
        console.warn("No id_token in response:", response);
      }
    } else if (response?.type) {
      console.log("Auth response type:", response.type, response);
    }
  }, [response]);

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
      // must pass useProxy: true so expo proxy handles redirect
      const result = await promptAsync({ useProxy: true });
      // response handled in useEffect above
      return result;
    } catch (err) {
      console.error("googleSignIn error:", err);
      return { type: "error", error: err.message };
    }
  }, [promptAsync]);

  const logout = useCallback(async () => {
    try {
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
