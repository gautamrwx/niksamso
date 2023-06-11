import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const config = {
    apiKey: "AIzaSyAtMMUtzyav-51BsTPZoAUgggv7jfVSNvM",
    authDomain: "nikasamso-live-a7cb2.firebaseapp.com",
    projectId: "nikasamso-live-a7cb2",
    storageBucket: "nikasamso-live-a7cb2.appspot.com",
    messagingSenderId: "463608435944",
    appId: "1:463608435944:web:9c75d1d21b5ef5dd3ca55d"
};

const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getFirestore(app);