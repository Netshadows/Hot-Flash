// Firebase Configuration Placeholder
// Requires valid credentials from Firebase Console to work in production

const firebaseConfig = {
    apiKey: "AIzaSy_YOUR_API_KEY_HERE",
    authDomain: "hotflash-app.firebaseapp.com",
    projectId: "hotflash-13453545362374791117",
    storageBucket: "hotflash-app.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
    window.auth = firebase.auth();
} else {
    console.warn("Firebase SDK not loaded.");
}
