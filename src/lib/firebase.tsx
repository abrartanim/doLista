// lib/firebase.ts
"use client"; // This custom hook will be used in client components

import { useState, useEffect } from "react";
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  Auth,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Define the shape of the data our hook will return
interface FirebaseHookReturn {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  userId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Custom hook for Firebase initialization and auth state management
export function useFirebase(): FirebaseHookReturn {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Construct the Firebase configuration object from environment variables.
        // These are accessed via process.env in Next.js client-side components.
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId:
            process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
        };

        // Basic validation for essential config values
        if (
          !firebaseConfig.apiKey ||
          !firebaseConfig.projectId ||
          !firebaseConfig.appId
        ) {
          const configErrorMsg =
            "Missing Firebase environment variables. Please check your .env.local file.";
          console.error(configErrorMsg);
          setError(configErrorMsg);
          setLoading(false);
          return;
        }

        // Initialize the Firebase app
        const firebaseApp = initializeApp(firebaseConfig as any); // Cast as any for optional properties
        const authInstance = getAuth(firebaseApp);
        const firestoreInstance = getFirestore(firebaseApp);

        setApp(firebaseApp);
        setAuth(authInstance);
        setDb(firestoreInstance);

        // Set up authentication state change listener
        const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
          if (user) {
            // User is signed in (either existing session or anonymous sign-in below)
            setUserId(user.uid);
            setIsAuthenticated(true);
            console.log("User authenticated:", user.uid);
            setLoading(false); // Authentication complete, stop loading
          } else {
            // No user is signed in, attempt anonymous sign-in
            try {
              await signInAnonymously(authInstance);
              console.log("Signed in anonymously.");
              // The onAuthStateChanged listener will fire again with the anonymous user
            } catch (anonErr) {
              console.error("Error signing in anonymously:", anonErr);
              setError("Failed to authenticate anonymously.");
              setLoading(false); // Stop loading on error
            }
          }
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
      } catch (err) {
        // Catch errors during Firebase initialization itself
        console.error("Error initializing Firebase:", err);
        setError(
          "Failed to initialize Firebase app. Check console and .env.local."
        );
        setLoading(false);
      }
    };

    initializeFirebase();
  }, []); // Empty dependency array: runs only once on mount

  // Return the Firebase instances and status from the hook
  return { app, db, auth, userId, isAuthenticated, loading, error };
}
