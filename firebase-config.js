// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPwRCFuMrAlV544eBiWarQYBADA88Jr4",
  authDomain: "aura-hub-mlbb-matchmaking.firebaseapp.com",
  projectId: "aura-hub-mlbb-matchmaking",
  storageBucket: "aura-hub-mlbb-matchmaking.firebasestorage.app",
  messagingSenderId: "131113475682",
  appId: "1:131113475682:web:a94ec988cb62786b882cb",
  measurementId: "G-M3CNRJM6MB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// App စဖွင့်တာနဲ့ Anonymous (ကိုယ်စားလှယ်) အနေနဲ့ အလိုအလျောက် Login ဝင်ထားစေရန်
signInAnonymously(auth)
  .then((userCredential) => {
    console.log("Anonymous Auth Successful:", userCredential.user.uid);
  })
  .catch((error) => {
    console.error("Auth Error:", error);
  });