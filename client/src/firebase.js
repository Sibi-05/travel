// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "travel-dac38.firebaseapp.com",
  projectId: "travel-dac38",
  storageBucket: "travel-dac38.firebasestorage.app",
  messagingSenderId: "809708546895",
  appId: "1:809708546895:web:08601e1517f2ddcc11b33a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
