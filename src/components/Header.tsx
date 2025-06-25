// components/Header.tsx
"use client"; // Needs to be a client component to use the useAuth hook

import React from "react";
import MenuItem from "./MenuItem";
import GoogleSignInButton from "./GoogleSignInButton"; // Import the Google login button
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon
import { MdAccountCircle } from "react-icons/md"; // Fallback icon

import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const { user, isAuthenticated, loading, signInWithGoogle, signOutUser } =
    useAuth();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-between ">
      {/* App Title */}
      <div className="text-center mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold">
          <span className="bg-blue-500 text-white rounded-full px-2 py-1">
            Do
          </span>
          Lista
        </h1>
        <h2 className="mt-2 text-xl sm:text-xl text-gray-600">
          Organize your tasks efficiently
        </h2>
      </div>

      {/* User Account / Auth Actions */}
      <div className="flex items-center absolute right-4 top-7">
        {loading ? (
          <div className="text-gray-500 text-sm">Loading user...</div>
        ) : isAuthenticated ? (
          // If authenticated, show user info and logout button
          <div className="flex items-center space-x-4 ">
            <MenuItem
              account_name={user?.displayName || user?.email || "User"} // Use display name or email
              account_picture_url={user?.photoURL} // Pass the photo URL
            />
            <button
              onClick={signOutUser}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200 shadow-sm cursor-pointer"
              aria-label="Sign out"
            >
              <FaSignOutAlt />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        ) : // If not authenticated, show Google sign-in button
        // <GoogleSignInButton onClick={signInWithGoogle} disabled={loading} />
        null}
      </div>
    </div>
  );
}
