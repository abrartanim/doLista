// components/GoogleSignInButton.tsx
"use client";

import React from "react";
import { FaGoogle } from "react-icons/fa"; // For the Google icon

interface GoogleSignInButtonProps {
  onClick: () => Promise<void>; // Expects a function that initiates sign-in
  disabled?: boolean;
}

export default function GoogleSignInButton({
  onClick,
  disabled = false,
}: GoogleSignInButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg
        flex items-center justify-center space-x-2 transition-colors duration-200
        shadow-md hover:shadow-lg
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <FaGoogle size={20} />
      <span>Sign in with Google</span>
    </button>
  );
}
