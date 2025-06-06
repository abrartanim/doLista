import React from "react";

interface MenuItemProps {
  account_name: string;
  // account_picture: React.ReactNode; // Or a more specific type if you know what it will be (e.g., string for an image URL, or JSX.Element)
  account_picture: React.ReactElement;
}
export default function MenuItem({
  account_name,
  account_picture,
}: MenuItemProps) {
  return (
    <div className="flex items-center gap-2 ">
      <span className="text-base hidden md:inline">{account_name}</span>

      <div className="flex items-center">{account_picture}</div>
    </div>
  );
}
