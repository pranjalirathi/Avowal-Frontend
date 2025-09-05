// // src/screens/GoogleAuthScreen.jsx
// import React, { useState, useContext } from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Dimensions, 
//   StatusBar,
//   ActivityIndicator,
//   Alert 
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { AuthContext } from '../context/AuthContext';

// const { width } = Dimensions.get('window');

// const GoogleAuthScreen = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { googleSignIn } = useContext(AuthContext);

//   const handleGoogleSignIn = async () => {
//     console.log('🔘 Google Sign-In button pressed');
    
//     if (!googleSignIn) {
//       Alert.alert('Error', 'Google Sign-In not available');
//       return;
//     }
    
//     setIsLoading(true);
    
//     const result = await googleSignIn();
    
//     if (!result.success) {
//       Alert.alert('Authentication Failed', result.error);
//     }
    
//     setIsLoading(false);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.logoContainer}>
//         <Text style={styles.logo}>AVOWAL</Text>
//         <Text style={styles.tagline}>Anonymous Confessions</Text>
//       </View>

//       <View style={styles.authContainer}>
//         <Text style={styles.title}>Welcome</Text>
//         <Text style={styles.subtitle}>
//           Sign in with your college Google account to continue
//         </Text>

//         <TouchableOpacity 
//           style={[styles.googleButton, isLoading && styles.disabledButton]}
//           onPress={handleGoogleSignIn}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <ActivityIndicator size="small" color="#757575" />
//           ) : (
//             <>
//               <Icon name="google" size={24} color="#4285F4" style={styles.googleIcon} />
//               <Text style={styles.googleButtonText}>Continue with Google</Text>
//             </>
//           )}
//         </TouchableOpacity>

//         <View style={styles.infoContainer}>
//           <Text style={styles.infoText}>
//             🔒 Your identity remains anonymous
//           </Text>
//           <Text style={styles.infoText}>
//             🎓 College email verification required
//           </Text>
//           <Text style={styles.infoText}>
//             💬 Share confessions safely
//           </Text>
//         </View>
//       </View>

//       <StatusBar backgroundColor="#000000" barStyle="light-content" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 60,
//   },
//   logo: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 8,
//   },
//   tagline: {
//     fontSize: 16,
//     color: '#A1A1A1',
//     fontStyle: 'italic',
//   },
//   authContainer: {
//     width: width * 0.9,
//     maxWidth: 400,
//     backgroundColor: '#1E1E1E',
//     padding: 30,
//     borderRadius: 20,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#A1A1A1',
//     textAlign: 'center',
//     marginBottom: 40,
//     lineHeight: 22,
//   },
//   googleButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     borderRadius: 50,
//     width: '100%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   googleIcon: {
//     marginRight: 12,
//   },
//   googleButtonText: {
//     color: '#757575',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   infoContainer: {
//     marginTop: 40,
//     alignItems: 'center',
//   },
//   infoText: {
//     color: '#A1A1A1',
//     fontSize: 14,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
// });

// export default GoogleAuthScreen;


// src/screens/GoogleAuthScreen.jsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "../context/AuthContext";

const { width } = Dimensions.get("window");

const GoogleAuthScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { googleSignIn } = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    console.log("🔘 Google Sign-In button pressed");

    if (!googleSignIn) {
      Alert.alert("Error", "Google Sign-In not available");
      return;
    }

    setIsLoading(true);
    const result = await googleSignIn();
    if (!result.success) {
      Alert.alert("Authentication Failed", result.error || "Please try again");
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>AVOWAL</Text>
        <Text style={styles.tagline}>Anonymous Confessions</Text>
      </View>

      <View style={styles.authContainer}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Sign in with your college Google account to continue
        </Text>

        <TouchableOpacity
          style={[styles.googleButton, isLoading && styles.disabledButton]}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#757575" />
          ) : (
            <>
              <Icon
                name="google"
                size={24}
                color="#4285F4"
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>🔒 Your identity remains anonymous</Text>
          <Text style={styles.infoText}>🎓 College email verification required</Text>
          <Text style={styles.infoText}>💬 Share confessions safely</Text>
        </View>
      </View>

      <StatusBar backgroundColor="#000000" barStyle="light-content" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#A1A1A1",
    fontStyle: "italic",
  },
  authContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: "#1E1E1E",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#A1A1A1",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  infoContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  infoText: {
    color: "#A1A1A1",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
});

export default GoogleAuthScreen;
