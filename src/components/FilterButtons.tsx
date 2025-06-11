import React from "react";
import { Task, FilterType } from "@/app/types";

interface FilterButtonsProps {
  tasks: Task[];
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
}
export default function FilterButtons({
  tasks,
  activeFilter,
  onSelectFilter,
}: FilterButtonsProps) {
  const allCount = tasks.length;
  const activeCount = tasks.filter((task) => task.status === "active").length;
  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const getButtonClasses = (filter: FilterType) => `
      px-4 py-2 rounded-md transition-colors duration-200 text-sm font-semibold
      ${
        activeFilter === filter
          ? "bg-black text-white"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }
    `;
  return (
    <div className="flex space-x-2 mb-6">
      <button
        className={getButtonClasses("all")}
        onClick={() => onSelectFilter("all")}
      >
        All ({allCount})
      </button>
      <button
        className={getButtonClasses("active")}
        onClick={() => onSelectFilter("active")}
      >
        Active ({activeCount})
      </button>
      <button
        className={getButtonClasses("completed")}
        onClick={() => onSelectFilter("completed")}
      >
        Completed ({completedCount})
      </button>
    </div>
  );
}
