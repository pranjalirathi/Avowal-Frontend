// src/config/GoogleSignInConfig.js
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '287084527646-7kocuo0ilqhg8gsekmlsqe57h747gq5c.apps.googleusercontent.com',
    offlineAccess: true,
    hostedDomain: '', // Optional: restrict to specific domain
    forceCodeForRefreshToken: true,
  });
};