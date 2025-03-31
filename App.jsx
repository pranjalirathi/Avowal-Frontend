// // import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// import React from 'react';

// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// import AuthStack from './src/navigation/AuthStack';
// import AppStack from './src/navigation/AppStack';
// import { AuthProvider } from './src/context/AuthContext';

// function App() {
//   return (
//     <AuthProvider>
//       <NavigationContainer>
//         {/* <AppStack/> */}
//         <AuthStack />
//     </NavigationContainer>
//     </AuthProvider>
//   );
// }

// export default App;


// import React from 'react';
// import { SafeAreaView } from 'react-native';
// // import LoginScreen from './src/screens/LoginScreen'; 
// import SignupScreen from './src/screens/SignupScreen';
// import { ThemeProvider } from './src/context/ThemeContext'

// const App = () => {
//   return (
//     <ThemeProvider>
//     <SafeAreaView style={{ flex: 1 }}>
//       {/* <LoginScreen /> */}
//       <SignupScreen/>
//     </SafeAreaView>
//     </ThemeProvider>
//   );
// };


// export default App;

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
