// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5_ed8E9stVVih38CcW-Q1l9Vod0dI80Y",
  authDomain: "inventory-24e34.firebaseapp.com",
  projectId: "inventory-24e34",
  storageBucket: "inventory-24e34.appspot.com",
  messagingSenderId: "399836952097",
  appId: "1:399836952097:web:3d6349cb310c3fd4131560",
  measurementId: "G-BL6P2ZT8JB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Async function to initialize analytics
const initializeAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
};

// Call the async function and store the result in analytics
let analytics = null;
initializeAnalytics().then(result => {
  analytics = result;
});

export const db = getFirestore(app);
export { app, analytics };
