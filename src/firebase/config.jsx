import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3HORx27QxW77zVYXAbe_199pPRosGgWI",
  authDomain: "sojourners-lun-auction.firebaseapp.com",
  projectId: "sojourners-lun-auction",
  storageBucket: "sojourners-lun-auction.firebasestorage.app",
  messagingSenderId: "418386152634",
  appId: "1:418386152634:web:2f61352d0f38e462c00683",
  measurementId: "G-1CSR5MSD3N",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
