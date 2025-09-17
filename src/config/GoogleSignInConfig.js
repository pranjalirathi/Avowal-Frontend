// src/config/GoogleSignInConfig.js
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from '@env';
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    offlineAccess: true,
    hostedDomain: '', // Optional: restrict to specific domain
    forceCodeForRefreshToken: true,
  });
};