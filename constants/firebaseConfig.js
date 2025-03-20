// firebaseConfig.js
import { initializeApp } from 'firebase/app'; //Start with the Firebase platform

import { getAuth } from 'firebase/auth';     // Enable user to sign in with own account

import { getFirestore } from 'firebase/firestore'; // Save data input from user into database

import { getStorage } from 'firebase/storage'; // Save file or image from user


// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqed2tCPX8SYXtTaMshQXHAmIzCtZ8Ikc",
  authDomain: "test-1-80c35.firebaseapp.com",
  projectId: "test-1-80c35",
  storageBucket: "test-1-80c35.appspot.com",
  messagingSenderId: "1067797969930",
  appId: "1:1067797969930:web:9ff80274b705da378d73f3",
  measurementId: "G-HM17GE0TJV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

