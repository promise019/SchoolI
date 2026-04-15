/**
 * Firebase Service Layer Placeholder
 * Replace with actual config from Firebase Console
 */

import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "schooli-app.firebaseapp.com",
  projectId: "schooli-app",
  storageBucket: "schooli-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

export const mockFetchUser = async (studentId: string) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: studentId,
        name: 'John Doe',
        department: 'Computer Science',
        level: '400',
        regNo: 'CSC/2026/001'
      });
    }, 1000);
  });
};
