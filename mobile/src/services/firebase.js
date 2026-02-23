// src/services/firebase.js

// Firebase requires standard RN packages for mobile, often react-native-firebase or the web JS SDK for Expo.
// We are using Expo Go / Web compatible config as requested.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';

// Replace these values with your actual Firebase project configuration found in the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSy_YOUR_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "13453545362374791117", // from stitch.json
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);

// Firebase Data Connect (PostgreSQL) is currently in preview and often requires the CLI to generate SDKs.
// We initialize Firestore here as the bridge, as Data Connect relies on the same project container.
export const auth = getAuth(app);
export const db = getFirestore(app);

// STUB: generateMedicalReport Cloud Function
// In production, this would be deployed to Cloud Functions and called via HTTPS.
export const generateMedicalReport = async (userId) => {
    console.log(\`[Cloud Function Stub] Generating Medical Report PDF for \${userId}...\`);
    console.log("[Gemini 3 Processing] Analyzing 90 days of patterns...");
    return {
        success: true,
        reportUrl: "https://example.com/mock-pdf-url.pdf"
    };
};

export const saveDailyActivity = async (activityId) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.log("[Firebase Stub] Anonymous Auth - Activity Complete: ", activityId);
            return { success: true, stub: true }; 
        }

        const docRef = await addDoc(collection(db, 'users', user.uid, 'activities'), {
            activityId,
            completedAt: serverTimestamp(),
        });
        console.log("Activity logged to Database with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { success: false, error: e };
    }
};
