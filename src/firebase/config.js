// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvEWuoQHG6UVYwMjsjJrRnytBaFvxfi5k",
  authDomain: "noticias-final.firebaseapp.com",
  projectId: "noticias-final",
  storageBucket: "noticias-final.firebasestorage.app",
  messagingSenderId: "292457087471",
  appId: "1:292457087471:web:33b2e221055ec8d3e9761a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export const auth =getAuth(app)
export default db