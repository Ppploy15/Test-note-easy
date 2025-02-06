// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";  // เพิ่มการนำเข้า onAuthStateChanged
import { getFirestore } from "firebase/firestore"; // นำเข้า Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOX-qcM8w5tTnKn9aazu1Z9TzDGuRXsb8",
  authDomain: "teat-note-easy.firebaseapp.com",
  projectId: "teat-note-easy",
  storageBucket: "teat-note-easy.firebasestorage.app",
  messagingSenderId: "247636796088",
  appId: "1:247636796088:web:acc03e93e6f3f3ce198a4d"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ เพิ่มการ export `auth`, `db`, และ `onAuthStateChanged`
export const auth = getAuth(app);
export const db = getFirestore(app);
export { onAuthStateChanged };  // ส่งออก `onAuthStateChanged`



