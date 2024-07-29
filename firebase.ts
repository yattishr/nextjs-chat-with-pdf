// Import the functions you need from the SDKs you need
import { initializeApp, getApps,  getApp} from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "chat-with-pdf-f75c7.firebaseapp.com",
  projectId: "chat-with-pdf-f75c7",
  storageBucket: "chat-with-pdf-f75c7.appspot.com",
  messagingSenderId: "349631853010",
  appId: "1:349631853010:web:56602c63246fe89c08180b",
  measurementId: "G-ZCJE3FTPB1"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };