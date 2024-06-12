// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import {  getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQhIj5z2fekwVzJmditSM11RFmnGx7HZM",
  authDomain: "fusiongreen-93d54.firebaseapp.com",
  databaseURL: "https://fusiongreen-93d54-default-rtdb.firebaseio.com",
  projectId: "fusiongreen-93d54",
  storageBucket: "fusiongreen-93d54.appspot.com",
  messagingSenderId: "1069757343911",
  appId: "1:1069757343911:web:2e5a9d7179baeed5d91382"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export default app;
const db = getDatabase(app);
const fs = getFirestore();
export {fs};
export { db };
