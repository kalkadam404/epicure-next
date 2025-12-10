import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDqcEB1UiNUD39QQCNFl6AfgdmOOw4WbsQ",
  authDomain: "epicure-auth.firebaseapp.com",
  projectId: "epicure-auth",
  storageBucket: "epicure-auth.firebasestorage.app",
  messagingSenderId: "463031939414",
  appId: "1:463031939414:web:9eba94a04a21b5b0cb26f7",
  measurementId: "G-4HCWWB3XK4"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);
export default app;



