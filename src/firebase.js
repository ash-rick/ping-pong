import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDuFjc2Ojs2edTJDcJHpqLDrFDlZ8tSfmA",
  authDomain: "ping-pong-dc000.firebaseapp.com",
  projectId: "ping-pong-dc000",
  storageBucket: "ping-pong-dc000.appspot.com",
  messagingSenderId: "572825467595",
  appId: "1:572825467595:web:60c8803a51b130d2c6394e",
  measurementId: "G-HLJT38ZBRJ",
  databaseURL:
    "https://ping-pong-dc000-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth  = getAuth(app);
const db = getDatabase(app);

export {db, auth}