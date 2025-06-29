import React, { useContext , useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { ActivityIndicator, View } from 'react-native';
import jwtDecode from 'jwt-decode';

const AppNavigator = () => {
  const { isLoading, userToken, logout} = useContext(AuthContext);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const linking = {
    prefixes: ['avowal://', 'https://avowal-backend.vercel.app'], 
    config: {
      screens: {
        ResetPassword: 'reset-password/:token',
      },
    },
  };

  useEffect(() => {
    if (userToken) {
      try {
        const decoded = jwtDecode(userToken);
        const isExpired = decoded.exp < Date.now() / 1000;
        setIsTokenValid(!isExpired);
        if (isExpired) {
          logout();
        }
      } catch (error) {
        setIsTokenValid(false);
        logout();
      }
    } else {
      setIsTokenValid(false);
    }
  }, [userToken]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E94560" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {userToken !== null ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
