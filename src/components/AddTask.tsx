"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Task } from "@/app/types";
interface AddTaskFormProps {
  onAddTask: (newTask: Omit<Task, "id" | "createdAt" | "status">) => void;
}

export default function AddTask({ onAddTask }: AddTaskFormProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Task Title: ", taskTitle);
    console.log("Task Descrition: ", taskDescription);

    onAddTask({
      title: taskTitle.trim(),
      description: taskDescription.trim(),
    });

    setTaskTitle("");
    setTaskDescription("");
  };

  const isButtonActive = taskTitle.trim() !== "";
  return (
    <div className="bg-slate-100 p-6 rounded-lg shadow-md w-full max-w-full mx-auto mt-4">
      <div className="flex items-center text-lg font-semibold text-gray-800 mb-4">
        <FaPlus className="mr-2" />
        <h2>Add New Task</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            id="taskTitle"
            className="border rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            id="taskDescription"
            className="border rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="Task Description (optional)"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className={`w-full  text-white py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 flex items-center justify-center transition-colors duration-300 ease-in-out ${
            isButtonActive
              ? "bg-black hover:bg-gray-900 focus:ring-gray-700 shadow-sm shadow-white"
              : "bg-gray-400"
          }`}
        >
          <FaPlus className="mr-2" />
          Add task
        </button>
      </form>
    </div>
  );
}
