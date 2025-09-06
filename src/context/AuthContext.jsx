import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { WEB_CLIENT_ID } from "../config/GoogleConfig";
import BASE_URL from "../constants/api";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error("Error reading storage:", err);
      } finally {
        setIsLoading(false);
        
      }
    })();
  }, []);

  const handleGoogleResponse = async (idToken) => {
    try {
      console.log(`Line : 40 : ${idToken}`)
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
      // await AsyncStorage.setItem("userInfo", JSON.stringify(data.user));

      setUserToken(data.access_token);
      console.log("this is the access token", data.access_token);

      // setUserInfo(data.user);
      // console.log("this is the user info", data.user);

      console.log("✅ Auth successful:", data.user?.email);
    } catch (err) {
      console.error("Authentication error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log("✅ Play Services available");

      // Get the full user info object to see what is being returned
      const userInfo = await GoogleSignin.signIn();
      console.log("✅ Google Sign-In successful, received:", JSON.stringify(userInfo, null, 2));

      // FORCEFUL TEST: Remove the 'if' check and try to use the idToken directly.
      // This will either work or throw a new error if idToken is truly null.
      console.log("FORCEFUL TEST: ATTEMPTING to use idToken...");
      console.log(userInfo.data.idToken)
      handleGoogleResponse(userInfo.data.idToken);

    } catch (error) {
      // It's helpful to see the full error object
      console.error("googleSignIn error:", JSON.stringify(error, null, 2));
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
