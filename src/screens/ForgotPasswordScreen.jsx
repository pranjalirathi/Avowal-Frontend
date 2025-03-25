import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window'); 

const ForgotPasswordScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AVOWAL</Text>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot Your password</Text>
        <Text style={styles.subtitle}>Please enter your email.</Text>

        {/* Email Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A1A1A1"
          />
          <TouchableOpacity style={styles.icon}>
            <Icon name="mail" size={20} color="#A1A1A1" />
          </TouchableOpacity>
        </View>

        {/* Reset Password Button */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Reset Password</Text>
        </TouchableOpacity>

        {/* Signup Text */}
        <Text style={styles.signupText}>
          <Text style={styles.signupLink} onPress={() => navigation.replace('LoginScreen')}>Back to Login</Text>
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
});

export default ForgotPasswordScreen;
