import React from "react";

// An array to hold the data for our cards.
// This makes it easy to add or remove cards in the future.
const taskStats = [
  {
    count: 2,
    label: "Total Tasks",
    color: "text-blue-600",
  },
  {
    count: 2,
    label: "Active Tasks",
    color: "text-red-500",
  },
  {
    count: 0,
    label: "Completed",
    color: "text-green-500",
  },
];

export default function TaskCount() {
  return (
    // Main container with a light background to match the image
    // It uses flexbox to center the content both vertically and horizontally
    <div className="bg-slate-100 p-8 flex justify-center items-center min-h-screen">
      {/* Container for the cards.
          - On small screens (mobile), cards stack vertically (`flex-col`).
          - On medium screens and larger, they align in a row (`md:flex-row`).
          - `gap-6` adds space between the cards.
      */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* We map over the taskStats array to create a card for each item */}
        {taskStats.map((stat, index) => (
          <div
            key={index}
            // Individual card styling
            className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center justify-center w-60"
          >
            {/* The large number, styled with the color from our array */}
            <p className={`text-5xl font-bold ${stat.color}`}>{stat.count}</p>

            {/* The label text below the number */}
            <p className="text-base text-gray-500 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
