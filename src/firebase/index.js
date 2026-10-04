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
  apiKey: "AIzaSyAt7DAJ6eaF0V3L9utj6RYjKqj1UEmAFMg",
  authDomain: "tech-elect.firebaseapp.com",
  projectId: "tech-elect",
  storageBucket: "tech-elect.firebasestorage.app",
  messagingSenderId: "450863205672",
  appId: "1:450863205672:web:ff24479bce5f121535541d"
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

