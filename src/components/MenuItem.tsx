import React from "react";

export default function MenuItem({ acnt_name, acnt_picture }) {
  return (
    <div className="flex items-center gap-2 ">
      <span className="text-base hidden md:inline">{acnt_name}</span>
      {/* <img
        src={acnt_picture}
        alt={acnt_name}
        className="w-6 h-6 rounded-full"
      /> */}
      <div className="flex items-center">{acnt_picture}</div>
    </div>
  );
}
