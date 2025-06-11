// components/TaskCard.tsx
import React from "react";
import {
  FaCheckCircle,
  FaRegCircle,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa"; // Icons for check/uncheck, edit, delete
import { Task } from "@/types"; // Import Task type

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEditTask: (id: string) => void; // Placeholder for edit functionality
  onDeleteTask: (id: string) => void;
}

export default function TaskCard({
  task,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-start">
      {/* Check/Uncheck Icon */}
      <button
        onClick={() => onToggleStatus(task.id)}
        className={`flex-shrink-0 mr-4 mt-1 ${
          isCompleted ? "text-green-500" : "text-gray-400"
        } hover:text-green-600`}
      >
        {isCompleted ? <FaCheckCircle size={20} /> : <FaRegCircle size={20} />}
      </button>

      {/* Task Content */}
      <div className="flex-grow">
        <h3
          className={`text-lg font-semibold ${
            isCompleted ? "line-through text-gray-500" : "text-gray-800"
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p
            className={`text-gray-600 text-sm mb-2 ${
              isCompleted ? "line-through" : ""
            }`}
          >
            {task.description}
          </p>
        )}
        <div className="flex items-center text-xs text-gray-500">
          <span
            className={`px-2 py-0.5 rounded-full text-white mr-2 ${
              isCompleted ? "bg-green-500" : "bg-blue-500"
            }`}
          >
            {task.status === "active" ? "Active" : "Completed"}
          </span>
          <span>Created: {task.createdAt}</span>
        </div>
      </div>

      {/* Action Icons (Edit & Delete) */}
      <div className="flex-shrink-0 ml-4 flex space-x-2 mt-1">
        <button
          onClick={() => onEditTask(task.id)}
          className="text-blue-500 hover:text-blue-600"
          aria-label={`Edit task: ${task.title}`}
        >
          <FaPencilAlt size={16} />
        </button>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-red-500 hover:text-red-600"
          aria-label={`Delete task: ${task.title}`}
        >
          <FaTrashAlt size={16} />
        </button>
      </div>
    </div>
  );
}
