// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDfg6ZcahC6s7dEF5IsEBFaRUxtZ21fU5s",
    authDomain: "crop-recommendation-syst-92fe6.firebaseapp.com",
    databaseURL: "https://crop-recommendation-syst-92fe6-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "crop-recommendation-syst-92fe6",
    storageBucket: "crop-recommendation-syst-92fe6.appspot.com",
    messagingSenderId: "230522535352",
    appId: "1:230522535352:web:9c93f2433a16ea6d4c634d",
    measurementId: "G-VH3S7VDZRN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, get };
