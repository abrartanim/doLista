// components/Footer.tsx
"use client"; // If it contains client-side logic or is used in a client component

import React from "react";

export default function Footer() {
  return (
    // This div contains your footer content
    <div className="flex justify-center items-center py-4 text-gray-600 text-sm  mt-auto">
      {/* Assuming your icon is an image or an SVG/div like before */}
      <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white mr-2">
        <span className="text-xs">A</span> {/* Or your actual icon */}
      </div>
      <h3>Developed by Abrar Tanim</h3>
    </div>
  );
}
