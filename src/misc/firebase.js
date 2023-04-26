import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const config = {
    apiKey: "AIzaSyDVZuh-qicfH-MBECtpCi4UY-OT41_GauI",
    authDomain: "niksamso-test.firebaseapp.com",
    projectId: "niksamso-test",
    storageBucket: "niksamso-test.appspot.com",
    messagingSenderId: "19208849233",
    appId: "1:19208849233:web:a8dd2cbc5598c8e18f3570",
    measurementId: "G-37610VZ1F1"
};

const app = initializeApp(config);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getFirestore(app);