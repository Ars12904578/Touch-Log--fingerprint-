// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiam8iSiBI9BiTLSB9l_HdmoZbKl_ropc",
  authDomain: "arvi-a7877.firebaseapp.com",
  databaseURL: "https://arvi-a7877-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "arvi-a7877",
  storageBucket: "arvi-a7877.firebasestorage.app",
  messagingSenderId: "406459166420",
  appId: "1:406459166420:web:8d0af64755b3a38a701541",
  measurementId: "G-RWY6ESJ7GN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");

export const signInWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

export const signInWithMicrosoft = () =>
  signInWithPopup(auth, microsoftProvider);

export const signOutUser = () => signOut(auth);

