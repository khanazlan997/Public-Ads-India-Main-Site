import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  limit,
  orderBy
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDKyVNBYKUItn3IcQEM3xyS4f5H1pFJEyI",
  authDomain: "corded-cedar-lwh20.firebaseapp.com",
  projectId: "corded-cedar-lwh20",
  storageBucket: "corded-cedar-lwh20.firebasestorage.app",
  messagingSenderId: "381615250882",
  appId: "1:381615250882:web:f50478ab3866f8ba638a5b"
};

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, "ai-studio-1d3c5653-93f4-411f-bd71-32fe9be35e38");

export { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  limit, 
  orderBy 
};
