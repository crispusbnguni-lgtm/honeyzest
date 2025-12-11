import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDM8CZ0UTb5SHKyCAU6CCQQN_4HEexJlg4",
  authDomain: "honeyzest.firebaseapp.com",
  projectId: "honeyzest",
  storageBucket: "honeyzest.firebasestorage.app",
  messagingSenderId: "613798541866",
  appId: "1:613798541866:web:959968d4710d640803a153"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
