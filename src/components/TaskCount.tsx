import React from "react";
import { Task, FilterType } from "@/app/types";
interface FilterButtonsProps {
  tasks: Task[];
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
}

export default function TaskCount({
  tasks,
  activeFilter,
  onSelectFilter,
}: FilterButtonsProps) {
  const allCount = tasks.length;
  const activeCount = tasks.filter((task) => task.status === "active").length;
  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const taskStats = [
    {
      count: allCount,
      label: "Total Tasks",
      color: "text-blue-600",
    },
    {
      count: activeCount,
      label: "Active Tasks",
      color: "text-red-500",
    },
    {
      count: completedCount,
      label: "Completed",
      color: "text-green-500",
    },
  ];

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
