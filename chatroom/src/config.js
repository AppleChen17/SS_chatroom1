// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0exS8qlQEvP-xKlTDehOlhmhq0m1D5XA",
  authDomain: "myawesomechatroom-f1848.firebaseapp.com",
  databaseURL: "https://myawesomechatroom-f1848-default-rtdb.firebaseio.com",
  projectId: "myawesomechatroom-f1848",
  storageBucket: "myawesomechatroom-f1848.firebasestorage.app",
  messagingSenderId: "231518148178",
  appId: "1:231518148178:web:b98d5788726a7cdab4b18b",
  measurementId: "G-QH2LEK2KGE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app); //authentication
export { app, database,auth };