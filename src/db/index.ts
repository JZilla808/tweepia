import { initializeApp } from "firebase/app";
import { collection, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBywlX3nlNrDk015RfChK3N0sGaJbHiiVc",
  authDomain: "tweepia.firebaseapp.com",
  projectId: "tweepia",
  storageBucket: "tweepia.appspot.com",
  messagingSenderId: "548734445963",
  appId: "1:548734445963:web:7109f6e8f9c3a3e2fa678e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

//Initialize Firestore
export const db = getFirestore(app);

//Initialize Auth
export const firebaseAuth = getAuth(app);
