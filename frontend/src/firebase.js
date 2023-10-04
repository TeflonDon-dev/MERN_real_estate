// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-2463e.firebaseapp.com",
  projectId: "mern-estate-2463e",
  storageBucket: "mern-estate-2463e.appspot.com",
  messagingSenderId: "658422664641",
  appId: "1:658422664641:web:29bb6984fb17c90dcb3340"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);