// src/services/firebase.js

// Firebase requires standard RN packages for mobile, often react-native-firebase or the web JS SDK for Expo.
// We are using Expo Go / Web compatible config as requested.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, addDoc, collection, serverTimestamp, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

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
    console.log("[Cloud Function Stub] Generating Medical Report PDF for " + userId + "...");
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

// Journal Stubs
let mockJournalEntries = [];

export const saveJournalEntry = async (userId, entryData) => {
    console.log("[Firebase Stub] Saving Journal Entry for " + userId + ":", entryData);
    mockJournalEntries.unshift({ ...entryData, id: Math.random().toString() });
    return { success: true };
};

export const getJournalEntries = async (userId) => {
    console.log("[Firebase Stub] Fetching Journal Entries for " + userId);
    return mockJournalEntries;
};

// Simulation of 30 days of symptom tracking across 3 categories (0-10 scale)
export const getMonthlySymptoms = async (userId) => {
    console.log("[Firebase Stub] Generating 30-day symptom data for " + userId);

    // Helper to generate natural looking curve data with some noise
    const generateCurve = (base, frequency, amplitude, length) => {
        return Array.from({ length }, (_, i) => {
            let val = base + Math.sin(i * frequency) * amplitude + (Math.random() * 2 - 1);
            return Math.max(0, Math.min(10, val));
        });
    };

    return [
        {
            id: 'vasomotor',
            name: 'Vasomotor',
            data: generateCurve(4, 0.4, 5, 30) // Taller Peaks and valleys
        },
        {
            id: 'psychological',
            name: 'Psychological',
            data: generateCurve(3, 0.15, 4, 30) // Slower wave, taller
        },
        {
            id: 'somatic',
            name: 'Somatic',
            data: generateCurve(2, 0.6, 4, 30) // More frequent shifts, taller
        }
    ];
};

// Calendar / Timeline Persistence
export const saveCalendarData = async (userId, day, month, year, data) => {
    try {
        const docId = `${year}-${month}-${day}`;
        await setDoc(doc(db, 'users', userId, 'calendar', docId), {
            ...data,
            day,
            month,
            year,
            updatedAt: serverTimestamp(),
        });
        return { success: true };
    } catch (e) {
        console.error("Error saving calendar data: ", e);
        return { success: false, error: e };
    }
};

export const getCalendarData = async (userId, month, year) => {
    try {
        const q = query(
            collection(db, 'users', userId, 'calendar'),
            where('month', '==', month),
            where('year', '==', year)
        );
        const querySnapshot = await getDocs(q);
        const data = {};
        querySnapshot.forEach((doc) => {
            data[doc.data().day] = doc.data().flow;
        });
        return data;
    } catch (e) {
        console.error("Error fetching calendar data: ", e);
        return {};
    }
};

export const removeCalendarData = async (userId, day, month, year) => {
    try {
        const docId = `${year}-${month}-${day}`;
        await deleteDoc(doc(db, 'users', userId, 'calendar', docId));
        return { success: true };
    } catch (e) {
        console.error("Error deleting calendar data: ", e);
        return { success: false, error: e };
    }
};
