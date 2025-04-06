import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ConfessionsProvider } from './src/context/ConfessionsContext';

const App = () => {
  return (
    <ConfessionsProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
    </ConfessionsProvider>
  );
};

export default App;
