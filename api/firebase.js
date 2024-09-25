// Import the functions you need from the SDKs you need
import { initializeApp, firebase } from "firebase/app";
import {getAuth, initializeAuth, getReactNativePersistence} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxDk5U3DFXnR31ZDWFRRfU7_-zbsI0fws",
  authDomain: "dbuser-ae438.firebaseapp.com",
  projectId: "dbuser-ae438",
  storageBucket: "dbuser-ae438.appspot.com",
  messagingSenderId: "643686592553",
  appId: "1:643686592553:web:7173f8c3544e076bba6c38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const dbuser = getFirestore(app);