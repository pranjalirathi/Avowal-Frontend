import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, ActivityIndicator, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const GoogleAuthScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { googleSignIn, authError, setAuthError } = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    console.log("🔘 Google Sign-In button pressed");

    if (!googleSignIn) {
      Alert.alert("Error", "Google Sign-In not available");
      return;
    }

    setIsLoading(true);
    try {
      const result = await googleSignIn();
      if (!result.success) {
        // Don't show alert for cancellation
        if (result.error !== "Sign-in was cancelled") {
          setAuthError(result.error || "Please try again");
        }
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0A0A0B" barStyle="light-content" />
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.logo}>AVOWAL</Text>
        <View style={styles.logoAccent} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in with your college Google account to continue your anonymous journey
          </Text>
        </View>

        {authError && (
          <View style={styles.errorContainer}>
            <View style={styles.errorIconContainer}>
              <Text style={styles.errorIcon}>⚠</Text>
            </View>
            <Text style={styles.errorText}>{authError}</Text>
          </View>
        )}

        <View style={styles.authSection}>
          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.disabledButton]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.loadingText}>Signing in...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <View style={styles.googleIconPlaceholder}>
                  <Text style={styles.googleIcon}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>🔒</Text>
            </View>
            <Text style={styles.featureText}>Complete anonymity guaranteed</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>🛡️</Text>
            </View>
            <Text style={styles.featureText}>Secure & encrypted confessions</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>👥</Text>
            </View>
            <Text style={styles.featureText}>Connect with your college community</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0B',
  },
  
  headerSection: {
    alignItems: 'center',
    paddingTop: height * 0.1,
    paddingBottom: 40,
  },
  
  logo: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 8,
  },
  
  logoAccent: {
    width: 60,
    height: 3,
    backgroundColor: '#E94560',
    borderRadius: 2,
  },
  
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  
  welcomeSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: '400',
  },
  
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderColor: 'rgba(255, 59, 48, 0.3)',
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  
  errorIconContainer: {
    marginRight: 12,
  },
  
  errorIcon: {
    fontSize: 18,
    color: '#FF3B30',
  },
  
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  
  authSection: {
    marginBottom: 40,
  },
  
  googleButton: {
    backgroundColor: '#E94560',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#E94560',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  googleIconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 99,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  googleIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E94560',
  },
  
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  
  disabledButton: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  
  featuresSection: {
    paddingHorizontal: 8,
  },
  
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  featureIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  featureIconText: {
    fontSize: 18,
  },
  
  featureText: {
    color: '#8E8E93',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  
  footerText: {
    color: '#6D6D80',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '400',
  },
});

export default GoogleAuthScreen;