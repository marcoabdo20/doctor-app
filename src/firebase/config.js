import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ⚠️ استبدل هذه القيم بقيم مشروعك من Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBNfGX4T226BylCv5SqHGd1VaxFhmiVdFw",
  authDomain: "doctor-appointment-app-ca8f9.firebaseapp.com",
  projectId: "doctor-appointment-app-ca8f9",
  storageBucket: "doctor-appointment-app-ca8f9.firebasestorage.app",
  messagingSenderId: "846493811287",
  appId: "1:846493811287:web:0f5172578f8adeae6dd912"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير الخدمات
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;