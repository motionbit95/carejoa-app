// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-Mek9C2tSfd97xfdAKmvlQtEUf3oJ2lY",
  authDomain: "motionbit-doc.firebaseapp.com",
  projectId: "motionbit-doc",
  storageBucket: "motionbit-doc.appspot.com",
  messagingSenderId: "538210576070",
  appId: "1:538210576070:web:994485e9ed44db860b19c7",
  measurementId: "G-KBHLFK367R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
