// lib/firebase.ts
"use client"; // This custom hook will be used in client components

import { useState, useEffect } from "react";
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously, // Keeping for potential fallback if needed, but not auto-triggered
  onAuthStateChanged,
  GoogleAuthProvider, // Import Google Auth Provider
  signInWithPopup, // Import signInWithPopup for Google login
  signOut, // Import signOut for logging out
  Auth,
  User, // Import User type
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Define the shape of the data our hook will return
interface FirebaseHookReturn {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  user: User | null; // NEW: The full Firebase User object
  userId: string | null;
  isAuthenticated: boolean;
  loading: boolean; // Indicates if Firebase setup/auth check is in progress
  error: string | null;
  signInWithGoogle: () => Promise<void>; // Function to sign in with Google
  signOutUser: () => Promise<void>; // Function to sign out
}

// Custom hook for Firebase initialization and auth state management
export function useFirebase(): FirebaseHookReturn {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [user, setUser] = useState<User | null>(null); // NEW: State for the User object
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Initial loading state
  const [error, setError] = useState<string | null>(null);

  // --- Firebase Initialization and Auth State Listener ---
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

        // This listener will be called when auth state changes (sign in/out).
        // It's robust and automatically handles session persistence.
        const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
          if (currentUser) {
            setUser(currentUser); // NEW: Set the full user object
            setUserId(currentUser.uid);
            setIsAuthenticated(true);
            console.log(
              "User authenticated:",
              currentUser.uid,
              currentUser.email
            );
          } else {
            setUser(null); // NEW: Clear user object
            setUserId(null);
            setIsAuthenticated(false);
            console.log("User is signed out.");
          }
          setLoading(false); // Auth check complete, stop loading regardless of user status
        });

        return () => unsubscribe(); // Cleanup the listener
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
  }, []); // Runs once on mount

  // --- Google Sign-In Function ---
  const signInWithGoogle = async () => {
    if (!auth) {
      setError("Authentication service not available.");
      return;
    }
    setLoading(true); // Indicate loading while sign-in is in progress
    setError(null); // Clear previous errors

    try {
      const provider = new GoogleAuthProvider();
      // Optional: Add custom parameters if needed (e.g., forcing account selection)
      // provider.setCustomParameters({ prompt: 'select_account' });

      // Open Google sign-in popup
      const result = await signInWithPopup(auth, provider);
      // The user is automatically set by onAuthStateChanged listener
      console.log("Google Sign-in successful:", result.user.uid);
    } catch (googleError: any) {
      console.error("Error during Google Sign-in:", googleError);
      let errorMessage = "Failed to sign in with Google.";
      if (googleError.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in popup closed by user.";
      } else if (googleError.code === "auth/cancelled-popup-request") {
        errorMessage = "Sign-in popup already open.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false); // Stop loading after sign-in attempt (success or failure)
    }
  };

  // --- Sign-Out Function ---
  const signOutUser = async () => {
    if (!auth) {
      setError("Authentication service not available.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
    } catch (signoutError: any) {
      console.error("Error signing out:", signoutError);
      setError("Failed to sign out.");
    } finally {
      setLoading(false);
    }
  };

  // Return all necessary states and functions
  return {
    app,
    db,
    auth,
    user,
    userId,
    isAuthenticated,
    loading,
    error,
    signInWithGoogle,
    signOutUser,
  };
}
