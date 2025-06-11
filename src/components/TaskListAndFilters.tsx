// components/TaskListAndFilters.tsx
"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns"; // For formatting dates
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { Task, FilterType } from "@/app/types"; // Import types

// Import the sub-components
import AddTask from "./AddTask";
import FilterButtons from "./FilterButtons";
import TaskCard from "./TaskCard";

export default function TaskListAndFilters() {
  // Use a state for the tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Initialize with some mock data, matching the image date
    const today = format(new Date(), "M/d/yyyy"); // "6/11/2025" assuming current date is 6/11/2025
    return [
      {
        id: uuidv4(),
        title: "Learn Next.js",
        description: "Complete the Next.js tutorial and build a todo app",
        status: "active",
        createdAt: today,
      },
      {
        id: uuidv4(),
        title: "Setup Backend API",
        description: "Create REST API endpoints for todo CRUD operations",
        status: "active",
        createdAt: today,
      },
    ];
  });

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // --- Task Management Functions ---

  const handleAddTask = (
    newTaskData: Omit<Task, "id" | "createdAt" | "status">
  ) => {
    const today = format(new Date(), "M/d/yyyy");
    const newTask: Task = {
      id: uuidv4(),
      title: newTaskData.title,
      description: newTaskData.description,
      status: "active", // New tasks are active by default
      createdAt: today,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]); // Add new task to the top
  };

  const handleToggleStatus = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "active" ? "completed" : "active",
            }
          : task
      )
    );
  };

  const handleEditTask = (id: string) => {
    // Placeholder for actual edit functionality
    // In a real app, this would likely open a modal or navigate to an edit page
    console.log(`Edit task with ID: ${id}`);
    alert(`Edit task with ID: ${id} - (Functionality to be added)`);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // --- Filtering Logic ---
  const filteredTasks = useMemo(() => {
    if (activeFilter === "all") {
      return tasks;
    } else {
      return tasks.filter((task) => task.status === activeFilter);
    }
  }, [activeFilter, tasks]);

  return (
    <div>
      {/* Add Task Form */}
      <AddTask onAddTask={handleAddTask} />

      {/* Filter Buttons */}
      <div className="mt-8 flex justify-center">
        {" "}
        {/* Centered filters */}
        <FilterButtons
          tasks={tasks} // Pass all tasks for counting
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />
      </div>

      {/* Task List */}
      <div className="mt-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            No {activeFilter} tasks found.
          </div>
        )}
      </div>
    </div>
  );
}
