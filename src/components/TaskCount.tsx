import React from "react";

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
    count: 2,
    label: "Completed",
    color: "text-green-500",
  },
];
export default function TaskCount() {
  return (
    <div className="flex justify-center items-center ">
      <div className="flex flex-col md:flex-row gap-6">
        {taskStats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-100 p-8 rounded-xl  shadow-md flex flex-col items-center justify-center w-60"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-base text-gray-500 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
