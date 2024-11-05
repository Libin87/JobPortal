// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: 'AIzaSyBRgzSzUbVPPB_Ch1HFOMvJI_ZcXHE8JvY',
//   authDomain: 'jobportal-51fcc.firebaseapp.com',
//   projectId: 'jobportal-51fcc',
//   storageBucket: 'jobportal-51fcc.firebasestorage.app',
//   messagingSenderId: '298357808599',
//   appId: '1:298357808599:web:1a6817bb4d7d0ef1ebff92',
// };
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
