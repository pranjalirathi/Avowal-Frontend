// src/config/GoogleSignInConfig.js
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '287084527646-nglimmvtjp2q6g2433qprub83c305gga.apps.googleusercontent.com',
    offlineAccess: true,
    hostedDomain: '', // Optional: restrict to specific domain
    forceCodeForRefreshToken: true,
  });
};