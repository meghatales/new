// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Replace with your apiKey
  authDomain: "meghatales-xyz.firebaseapp.com", // Replace with your authDomain
  projectId: "meghatales-xyz", // Replace with your projectId
  storageBucket: "meghatales-xyz.appspot.com", // Replace with your storageBucket
  messagingSenderId: "000000000000", // Replace with your messagingSenderId
  appId: "1:000000000000:web:xxxxxxxxxxxxxxxxxxxxxx" // Replace with your appId
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };

