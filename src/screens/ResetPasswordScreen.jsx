// import React , { useState } from 'react';
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import { BASE_URL } from '../constants/api';

// const { width } = Dimensions.get('window'); 

// const ResetPasswordScreen = ({ navigation }) => {

//     const route = useRoute();
//     const navigation = useNavigation();
//     const { token } = route.params || {};

//     const [newPassword, setNewPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState(null);
//     const [isTokenValid, setIsTokenValid] = useState(false);

//     useEffect(() => {
//         if (token) {
//           verifyToken();
//         }
//       }, [token]);

//       const verifyToken = async () => {
//         try {
//           const response = await fetch(`${BASE_URL}/verify-token?token=${token}`);
//           if (response.ok) {
//             setIsTokenValid(true);
//           } else {
//             setMessage("Invalid or expired token.");
//           }
//         } catch (error) {
//           setMessage("Error verifying token. Please try again.");
//         }
//       };

//       const handleResetPassword = async () => {
//         if (newPassword !== confirmPassword) {
//           setMessage("Passwords do not match.");
//           return;
//         }
    
//         setLoading(true);
//         try {
//           const response = await fetch(`${BASE_URL}/reset-password`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               token: token, // Send token to backend
//               new_password: newPassword,
//             }),
//           });
    
//           const data = await response.json();
//           if (response.ok) {
//             setMessage("Password reset successful! Redirecting...");
//             setTimeout(() => navigation.replace("Login"), 2000);
//           } else {
//             setMessage(data.detail || "Error resetting password.");
//           }
//         } catch (error) {
//           setMessage("Network error, please try again.");
//         }
//         setLoading(false);
//       };
    


//   return (
//     <View style={styles.container}>
//       <Text style={styles.logo}>AVOWAL</Text>

//       <View style={styles.formContainer}>
//         <Text style={styles.title}>Reset Your password</Text>
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="New Password"
//             secureTextEntry
//             value={newPassword}
//             onChangeText={setNewPassword}
//           />

//         <TextInput
//             style={styles.input}
//             placeholder="Confirm Password"
//             secureTextEntry
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//           />

//         {message && <Text style={styles.message}>{message}</Text>}

//         {/* New Password Input */}
//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             placeholderTextColor="#A1A1A1"
//             value={email}
//             onChangeText={setEmail}
//             autoCapitalize="none"
//             keyboardType="email-address"
//             numberOfLines={1} 
//             ellipsizeMode="tail" 
//           />
//           <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.icon}>
//                 <Icon name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#A1A1A1" />
//            </TouchableOpacity>
//         </View>


//         {/* Confirm Password Input */}
//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             placeholderTextColor="#A1A1A1"
//             value={email}
//             onChangeText={setEmail}
//             autoCapitalize="none"
//             keyboardType="email-address"
//             numberOfLines={1} 
//             ellipsizeMode="tail" 
//           />
//             <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.icon}>
//                 <Icon name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#A1A1A1" />
//             </TouchableOpacity>
//         </View>

//         {message && <Text style={[styles.message, { color: messageColor }]}>{message}</Text>}

//         {/* Reset Password Button */}
//         <TouchableOpacity style={[styles.resetPasswordButton, loading && styles.disabledButton]} onPress={handleResetPassword} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.resetText}>Submit</Text>}
//         </TouchableOpacity>

//         {/* Signup Text */}
//         <Text style={styles.signupText}>
//           <Text style={styles.signupLink} onPress={() => navigation.replace('LoginScreen')}>Back to Login</Text>
//         </Text>
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
//     width: 'auto',
//     height: 'auto'
//   },
//   logo: {
//     fontSize: 32, 
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 40,
//   },
//   formContainer: {
//     width: width * 0.9,
//     maxWidth: 400,
//     backgroundColor: '#1E1E1E',
//     padding: 20,
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 4 },
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     paddingBottom: 20,
//     textAlign: "center"
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#A1A1A1',
//     marginBottom: 20,
//   },
//   message: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 2,
//   },
//   input: {
//     flex: 1,  
//     color: '#fff',
//     paddingVertical: 12,
//     fontSize: 16,
//   },
//   passwordContainer: {
//     flexDirection: 'row',  
//     alignItems: 'center',  
//     backgroundColor: '#2A2A2A',
//     borderRadius: 30,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//   },
//   icon: {
//     marginLeft: 10
//   },
//   resetPasswordButton: {
//     backgroundColor: '#E94560',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//     borderRadius: 30
//   },
//   forgotPassword: {
//     color: '#E94560',
//     fontSize: 14,
//     fontWeight: 'bold',
//     textAlign: 'right',
//     marginBottom: 15,
//   },
//   resetText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   signupText: {
//     color: '#A1A1A1',
//     fontSize: 14,
//     textAlign: 'center',
//     marginTop: 15,
//   },
//   signupLink: {
//     color: '#E94560',
//     fontWeight: 'bold',
//   },
//   disabledButton: {
//     opacity : 0.5
//   }
// });

// export default ResetPasswordScreen;
// bas upar voh mai add ho gaya
// maan lo ek baar render kar lia , html mai add karna hai, array mai add nahi karna hai
// maan lo 2 ghnate mai user scroll kar raha hai, har 20 sec mai api call ho rahi hau
// broswer cache mai user specific 
// browser acche tab hota hai for slow net
// kya: kcuh bhi naya aaga na


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../constants/api"
const ResetPasswordScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = route.params || {}; 

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${BASE_URL}/verify-token?token=${token}`);
      if (response.ok) {
        setIsTokenValid(true);
      } else {
        setMessage("Invalid or expired token.");
      }
    } catch (error) {
      setMessage("Error verifying token. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token, 
          new_password: newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successful! Redirecting...");
        setTimeout(() => navigation.replace("Login"), 2000);
      } else {
        setMessage(data.detail || "Error resetting password.");
      }
    } catch (error) {
      setMessage("Network error, please try again.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>

      {isTokenValid ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {message && <Text style={styles.message}>{message}</Text>}

          <TouchableOpacity
            onPress={handleResetPassword}
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.error}>Invalid or expired token.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#E94560", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
  message: { color: "green", marginBottom: 10 },
  error: { color: "red", fontSize: 16 },
});

export default ResetPasswordScreen;


