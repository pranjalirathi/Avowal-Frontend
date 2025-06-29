import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();
// createContext() creates a context object. This object will hold shared values (login, logout, userToken, etc.).
// You’ll later wrap your app with a Provider that gives all its children access to this context.


// provider component that will wrap your app
// define what the context contains
export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return true; 
    }
  };

  const loadToken = async () => {
    try {
      let token = await AsyncStorage.getItem('userToken');
      if (token && !isTokenExpired(token)) {
        setUserToken(token);
      } else {
        // Token is expired or invalid, remove it
        await AsyncStorage.removeItem('userToken');
        setUserToken(null);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  const login = async (token) => {
    setUserToken(token);
    await AsyncStorage.setItem('userToken', token);
  };

  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};