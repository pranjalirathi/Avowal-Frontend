// App.jsx - Fixed version
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { ConfessionsProvider } from './src/context/ConfessionsContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  console.log('📱 App component rendered');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ConfessionsProvider>
          <AppNavigator />
        </ConfessionsProvider>
      </AuthProvider>
    </GestureHandlerRootView>    
  );
};

export default App;