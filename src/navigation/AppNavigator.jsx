import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { ActivityIndicator, View } from 'react-native';

const AppNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  const linking = {
    prefixes: ['avowal://', 'https://avowal-backend.vercel.app'], 
    config: {
      screens: {
        ResetPassword: 'reset-password/:token',
      },
    },
  };

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
