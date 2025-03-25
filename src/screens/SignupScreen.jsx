import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CustomAlert from '../components/Alert';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [alertData, setAlertData] = useState(null); 
  const [buttonColor, setButtonColor] = React.useState("#EF4444");

  const handleSignup = () => {
    if (!username || !email || !password) {
      setAlertData({
        type: 'error',
        message: 'Please fill in all fields.',
      });
      return;
    }

    fetch('http://your-backend-url/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message && data.message !== 'User created successfully') {
          setAlertData({
            type: 'error',
            message: data.message,
          });
        } else {
          setAlertData({
            type: 'success',
            message: 'Account created successfully. Please log in.',
          });
        //   setTimeout(() => navigation.replace('LoginScreen'), 1500);
        }
      })
      .catch(error => {
        setAlertData({
          type: 'error',
          message: 'Signup failed. Please try again.',
        });
        console.error('Signup error:', error);
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
            onChangeText={setEmail}
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
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.icon}>
            <Icon name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#A1A1A1" />
          </TouchableOpacity>
        </View>

        {/* Signup Button */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup} onPressIn={() => setButtonColor("#DC2626")} // Darker red on press
  onPressOut={() => setButtonColor("#EF4444")}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Text */}
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.replace('LoginScreen')}>
            Login Here
          </Text>
        </Text>
      </View>

      {/* Render custom alert if alertData exists */}
      {alertData && (
        <CustomAlert
          type={alertData.type}
          message={alertData.message}
          onClose={() => setAlertData(null)}
        />
      )}
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
  },
  inputContainer: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: 15,
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
});

export default SignupScreen;
