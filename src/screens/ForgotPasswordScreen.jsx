import React , { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import BASE_URL from '../constants/api';

const { width } = Dimensions.get('window'); 

const ForgotPasswordScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [messageColor, setMessageColor] = useState('#fff');
  const [loading, setLoading] = useState(false);

  // ----EMAIL VALIDATION----
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email.");
      setMessageColor("#D32F2F"); 
      return;
    }

    if (!isValidEmail(email)) {
      setMessage("Invalid email format.");
      setMessageColor("#D32F2F"); 
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageColor("#4CAF50");
      } else {
        setMessage(data.detail);
        setMessageColor("#D32F2F"); 
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setMessageColor("#E94560");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AVOWAL</Text>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot Your password</Text>

        {/* Email Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A1A1A1"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            numberOfLines={1} 
            ellipsizeMode="tail" 
          />
          <TouchableOpacity style={styles.icon}>
            <Icon name="mail" size={20} color="#A1A1A1" />
          </TouchableOpacity>
        </View>

        {message && <Text style={[styles.message, { color: messageColor }]}>{message}</Text>}

        {/* Reset Password Button */}
        <TouchableOpacity style={[styles.resetPasswordButton, loading && styles.disabledButton]} onPress={handleResetPassword} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.resetText}>Submit</Text>}
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
    paddingBottom: 20,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 14,
    color: '#A1A1A1',
    marginBottom: 20,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2,
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
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  icon: {
    marginLeft: 10
  },
  resetPasswordButton: {
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
  resetText: {
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
  disabledButton: {
    opacity : 0.5
  }
});

export default ForgotPasswordScreen;
