import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

// Configuration from firebase-applet-config.json Code
const firebaseConfig = {
  apiKey: "AIzaSyDKyVNBYKUItn3IcQEM3xyS4f5H1pFJEyI",
  authDomain: "corded-cedar-lwh20.firebaseapp.com",
  projectId: "corded-cedar-lwh20",
  storageBucket: "corded-cedar-lwh20.firebasestorage.app",
  messagingSenderId: "381615250882",
  appId: "1:381615250882:web:f50478ab3866f8ba638a5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore utilizing the specific database ID from settings with persistent caching enabled
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, "ai-studio-1d3c5653-93f4-411f-bd71-32fe9be35e38");

export { db };
