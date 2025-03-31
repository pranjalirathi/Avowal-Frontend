import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../constants/api'

const { width } = Dimensions.get('window'); 

const LoginScreen = () => {
  const navigation = useNavigation();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null); 
  
  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    setErrorMessage(null);
    
    const formBody = new URLSearchParams();
    formBody.append('username', email); 
    formBody.append('password', password);
  
    fetch("https://avowal-backend.vercel.app/login", {
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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText} >Login</Text>
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
    backgroundColor: '#2A2A2A',
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderRadius: 30
  },
  passwordContainer: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: 15,
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
    color: '#FF4C4C',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;

// har button mai jab tak network call poora na ho, response naa aaya tab tak activity indicator lagana hai and button ko disable kar do
