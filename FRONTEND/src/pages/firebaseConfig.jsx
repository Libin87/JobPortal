// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: '',
  authDomain: 'jobportal-51fcc.firebaseapp.com',
  projectId: 'jobportal-51fcc',
  storageBucket: 'jobportal-51fcc.firebasestorage.app',
  messagingSenderId: '298357808599',
  appId: '1:298357808599:web:1a6817bb4d7d0ef1ebff92',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
