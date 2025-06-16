// components/MenuItem.tsx
import React from "react";
import Image from "next/image"; // Import Next.js Image component

interface MenuItemProps {
  account_name: string | null | undefined; // Name can be null/undefined for new users
  account_picture_url: string | null | undefined; // NEW: URL for the profile picture
}

export default function MenuItem({
  account_name,
  account_picture_url,
}: MenuItemProps) {
  return (
    <div className="flex items-center gap-2 ">
      <span className="text-base hidden md:inline">
        {account_name || "Guest"}
      </span>{" "}
      {/* Display "Guest" if no name */}
      <div className="flex items-center">
        {account_picture_url ? (
          <Image
            src={account_picture_url}
            alt={account_name || "User account picture"}
            width={36} // Set appropriate size for your header
            height={36}
            className="rounded-full"
            priority // Prioritize loading for user-facing image
          />
        ) : (
          // Fallback if no picture URL is available (e.g., for anonymous users or new Google accounts)
          <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xl font-bold">
            {account_name ? account_name.charAt(0).toUpperCase() : "?"}{" "}
            {/* Display first initial or '?' */}
          </div>
        )}
      </div>
    </div>
  );
}
