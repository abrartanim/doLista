// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useFirebase } from "@/lib/firebase"; // Import your useFirebase hook
import { FirebaseApp } from "firebase/app";
import { Auth, User } from "firebase/auth";
import { Firestore } from "firebase/firestore";

// Define the shape of our context value
interface AuthContextType {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  user: User | null;
  userId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the context provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const firebaseData = useFirebase(); // Use your custom hook here

  return (
    <AuthContext.Provider value={firebaseData}>{children}</AuthContext.Provider>
  );
}

// Custom hook to consume the AuthContext easily
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
