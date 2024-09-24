// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig={
  apiKey: "AIzaSyBRgzSzUbVPPB_Ch1HFOMvJI_ZcXHE8JvY",
  authDomain: "jobportal-51fcc.firebaseapp.com",
  projectId: "jobportal-51fcc",
  storageBucket: "jobportal-51fcc.appspot.com",
  messagingSenderId: "298357808599",
  appId: "1:298357808599:web:b850c2f7e379c3adebff92",
  measurementId: "G-WPWEXLMJZD"
};

// Initialize Firebase
const app=initializeApp(firebaseConfig);
const analytics=getAnalytics(app);