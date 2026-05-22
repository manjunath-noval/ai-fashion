import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4lrVIm1korpuRgcOWmIjFBlx9NwLdy5I",
  authDomain: "auraai-8618f.firebaseapp.com",
  projectId: "auraai-8618f",
  storageBucket: "auraai-8618f.firebasestorage.app",
  messagingSenderId: "68085153492",
  appId: "1:68085153492:web:985b5f6f645851733a8541",
  measurementId: "G-SKSDS08H3D"
};

const app =
  initializeApp(firebaseConfig);

export const auth =
  getAuth(app);

export const db =
  getFirestore(app);