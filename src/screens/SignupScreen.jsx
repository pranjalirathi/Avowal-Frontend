import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ActivityIndicator } from "react-native";
import { BASE_URL } from "../constants/api";

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const validateInput = () => {
    if (!username || !email || !password) {
      setErrorMessage('Please fill in all fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Invalid email format.');
      return false;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return false;
    }
    return true;
  };

  const handleSignup = () => {
    if (!validateInput()) return;
    setIsLoading(true);
    
    fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
      .then(async (response) => {
        console.log(response); 
        const data = await response.json(); 

        if (!response.ok) {
          throw new Error(data.message || 'Signup failed.');
        }
        setErrorMessage(null);
        navigation.navigate("LoginScreen");
      })
      .catch((error) => {
        console.log(error.message);
        setErrorMessage(error.message);
      })
      .finally(() => {
        setIsLoading(false); 
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AVOWAL</Text>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Create an account to continue.</Text>

       
        {/* Username Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#A1A1A1"
            value={username}
            onChangeText={setUsername}
            numberOfLines={1} 
            ellipsizeMode="tail" 
          />
          <TouchableOpacity style={styles.icon}>
            <Icon name="user" size={20} color="#A1A1A1" />
          </TouchableOpacity>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A1A1A1"
            value={email}
            onChangeText={(text) => setEmail(text.trim().toLowerCase())}
            numberOfLines={1} 
            ellipsizeMode="tail" 
          />
          <TouchableOpacity style={styles.icon}>
            <Icon name="mail" size={20} color="#A1A1A1" />
          </TouchableOpacity>
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A1A1A1"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            numberOfLines={1} 
            ellipsizeMode="tail" 
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.icon}>
            <Icon name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#A1A1A1" />
          </TouchableOpacity>
        </View>

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        {/* Signup Button */}
        <TouchableOpacity 
          style={[styles.signupButton, isLoading && styles.disabledButton]} 
          onPress={handleSignup}
          disabled={isLoading}
        >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
              ) : (
              <Text style={styles.signupText}>Sign Up</Text>
              )}
        </TouchableOpacity>

        {/* Login Text */}
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.replace('LoginScreen')}>
            Login Here
          </Text>
        </Text>
      </View>
      
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: 'auto',
    height: 'auto',
  },
  logo: {
    fontSize: 32, 
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#A1A1A1',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2A2A2A',
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginBottom: 15,
    fontSize: 16,
    paddingRight: 40
  },
  inputContainer: {
    position: 'relative',
    width: "100%"
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  signupButton: {
    backgroundColor: '#E94560',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#A1A1A1',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
  },
  loginLink: {
    color: '#E94560',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginTop: 4,
    mmarginBottom: 10,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa', 
  },
});

export default SignupScreen;