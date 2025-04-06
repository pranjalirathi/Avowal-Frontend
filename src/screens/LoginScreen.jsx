import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator } from "react-native";
import { BASE_URL } from '../constants/api'

const { width } = Dimensions.get('window'); 

const LoginScreen = () => {
  const navigation = useNavigation();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);

  const validateInput = () => {
    if ( !email || !password) {
      setErrorMessage('Please fill in all fields.');
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validateInput()) return;
    setErrorMessage(null);
    setIsLoading(true);
    
    const formBody = new URLSearchParams();
    formBody.append('username', email); 
    formBody.append('password', password);
  
    fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Login failed');
        }
        return response.json();
      })
      .then((data) => {
        login(data.access_token); 
      })
      .catch((error) => {
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
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Please enter your email and password.</Text>

        {/* Email Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A1A1A1"
            value={email}
            onChangeText={setEmail}
            numberOfLines={1} 
            ellipsizeMode="tail" 
          />
          <TouchableOpacity style={styles.icon}>
            <Icon name="mail" size={20} color="#A1A1A1" />
          </TouchableOpacity>
        </View>


        {/* Password Input */}
        <View style={styles.passwordContainer}>
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

        {/* Forgot Password Link */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPasswordScreen')}>Forgot Password?</Text>
        </TouchableOpacity>

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={isLoading}
          >
           {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Signup Text */}
        <Text style={styles.signupText}>
          Don’t have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate('SignupScreen')}>Sign Up Here</Text>
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
    height: 'auto'
  },
  logo: {
    fontSize: 32, 
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    fontFamily: 'Poppins-Regular',
  },
  formContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
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
    flex: 1, 
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: '#2A2A2A',
      borderRadius: 30,
      marginBottom: 15,
      paddingHorizontal: 15,
  },
  icon: {
    marginLeft: 10
  },
  loginButton: {
    backgroundColor: '#E94560',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 30
  },
  forgotPassword: {
    color: '#E94560',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 15,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#A1A1A1',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
  },
  signupLink: {
    color: '#E94560',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5 
  },
});

export default LoginScreen;