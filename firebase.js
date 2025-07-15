// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-analytics.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { 
    getDatabase, 
    ref, 
    set, 
    get, 
    update 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDt3muENbjxXY1Pmd0ef4kdFN9tLeWWCRo",
    authDomain: "profile-page-47cac.firebaseapp.com",
    databaseURL: "https://profile-page-47cac-default-rtdb.firebaseio.com",
    projectId: "profile-page-47cac",
    storageBucket: "profile-page-47cac.firebasestorage.app",
    messagingSenderId: "654322522937",
    appId: "1:654322522937:web:c6e70e7f66178921fe26e8",
    measurementId: "G-HGKCJ900Z6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { 
    auth, 
    database, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged,
    ref, 
    set, 
    get, 
    update 
};