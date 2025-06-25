// components/TaskListAndFilters.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { format } from "date-fns"; // For formatting dates
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { Task, FilterType } from "@/app/types"; // Import types
import TaskCount from "./TaskCount";
import { FaSignOutAlt } from "react-icons/fa";
// Import the sub-components
import AddTask from "./AddTask";
import FilterButtons from "./FilterButtons";
import TaskCard from "./TaskCard";
import GoogleSignInButton from "./GoogleSignInButton";

// Firebase Core and Firestore/Auth Specifics
// import { initializeApp, FirebaseApp } from "firebase/app"; // Core Firebase app initialization
// import {
//   getAuth,
//   signInAnonymously,
//   onAuthStateChanged,
//   Auth,
//   User,
// } from "firebase/auth"; // Authentication methods
import {
  getFirestore, // Get the Firestore database instance
  collection, // Function to get a reference to a collection
  query, // Function to construct a database query
  onSnapshot, // Listen for real-time updates to a query
  addDoc, // Add a new document to a collection
  updateDoc, // Update an existing document
  deleteDoc, // Delete a document
  doc, // Get a reference to a specific document
  Firestore, // Type for the Firestore instance
  DocumentData, // Type for document data
  QueryDocumentSnapshot, // Type for a document snapshot in a query result
} from "firebase/firestore";

import { useFirebase } from "@/lib/firebase";
import { useAuth } from "@/app/context/AuthContext";
export default function TaskListAndFilters() {
  const {
    db,
    userId,
    isAuthenticated,
    loading,
    error,
    signInWithGoogle,
    signOutUser,
  } = useFirebase();
  // Use a state for the tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const { user } = useAuth();

  useEffect(() => {
    // Only proceed if Firestore DB instance, authentication status, and userId are available
    if (!db || !isAuthenticated || !userId) {
      console.log(
        "Waiting for Firebase DB, authentication, or userId to be ready before fetching tasks..."
      );
      setTasks([]); // Clear tasks if dependencies aren't ready (e.g., on initial load before auth)
      return;
    }

    // Get the application ID (Firebase Project ID) directly from environment variable
    const appId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!appId) {
      console.error(
        "Firebase Project ID (appId) is not defined in environment variables. Cannot fetch tasks."
      );
      // setError handled by useFirebase hook, but we can set a more specific one here if needed
      return;
    }

    // Construct the reference to the Firestore collection where tasks are stored.
    // This path MUST match the security rules you published in the Firebase Console.
    const tasksCollectionRef = collection(
      db,
      `artifacts/${appId}/users/${userId}/tasks`
    );

    // Create a query to listen for all documents in the 'tasks' collection.
    // onSnapshot provides real-time updates: any changes in Firestore will update your app immediately.
    const tasksQuery = query(tasksCollectionRef);

    console.log("Setting up Firestore real-time listener for tasks...");
    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        // Map the Firestore documents to your local Task interface
        const fetchedTasks: Task[] = snapshot.docs
          .map((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || "No Title",
              description: data.description || "",
              status: data.status || "active",
              createdAt: data.createdAt || format(new Date(), "M/d/yyyy"),
            } as Task;
          })
          .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });

        setTasks(fetchedTasks);
        console.log("Tasks fetched and updated from Firestore.");
      },
      (err) => {
        console.error("Error fetching tasks from Firestore:", err);
        // setError is managed by useFirebase for initialization errors,
        // but this could be a task-fetching specific error.
        // For simplicity, we'll let the loading/error state from useFirebase propagate.
      }
    );

    // Cleanup function
    return () => unsubscribe();
  }, [db, isAuthenticated, userId]);

  // --- Task Management Functions ---

  const handleAddTask = async (
    newTaskData: Omit<Task, "id" | "createdAt" | "status">
  ) => {
    if (!db || !userId) {
      console.error(
        "Firestore DB or userID is currently not available. Cannot add task."
      );
      return;
    }

    try {
      const today = format(new Date(), "M/d/yyyy");
      const taskToAdd = {
        // id: uuidv4(),
        title: newTaskData.title.trim(),
        description: newTaskData.description.trim(),
        status: "active", // New tasks are active by default
        createdAt: today,
      };

      const appId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (!appId) {
        console.error("Firebase Project ID is missing.");
        return;
      }
      await addDoc(
        collection(db, `artifacts/${appId}/users/${userId}/tasks`),
        taskToAdd
      );
      console.log("Task added successfully to Firestore.");
    } catch (err) {
      console.error("Error adding tasks");
    }
    // setTasks((prevTasks) => [newTask, ...prevTasks]); // Add new task to the top
  };

  const handleToggleStatus = async (id: string) => {
    if (!db || !userId) {
      console.error(
        "Firestore DB or userId not available. Cannot toggle task status."
      );
      return;
    }
    try {
      const appId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (!appId) {
        console.error("Firebase Project ID is missing.");
        return;
      }
      const taskRef = doc(db, `artifacts/${appId}/users/${userId}/tasks`, id);
      const currentTask = tasks.find((task) => task.id === id);

      if (currentTask) {
        const newStatus =
          currentTask.status === "active" ? "completed" : "active";
        await updateDoc(taskRef, { status: newStatus });
        console.log(`Task ${id} status updated to ${newStatus}.`);
      } else {
        console.warn(
          `Task with ID ${id} not found in local state for status toggle.`
        );
      }
    } catch (err) {
      console.error("Error toggling task status:", err);
    }
  };

  // const handleEditTask = async (id: string) => {
  //   console.log(`Initiating edit for task with ID: ${id}`);
  //   const taskToEdit = tasks.find((t) => t.id === id);
  //   if (taskToEdit) {
  //     console.log(`Task to edit: ${JSON.stringify(taskToEdit)}`);
  //   } else {
  //     console.warn(`Task with ID ${id} not found for editing.`);
  //   }
  // };

  const handleEditTask = (id: string) => {
    const taskToEdit = tasks.find((t) => t.id === id);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setEditedTitle(taskToEdit.title);
      setEditedDescription(taskToEdit.description);
    } else {
      console.warn(`Task with ID ${id} not found for editing.`);
    }
  };

  // NEW: handleSaveEdit to update the task in Firestore
  const handleSaveEdit = async () => {
    if (!db || !userId || !editingTask) {
      console.error(
        "Firestore DB, userId, or editingTask not available. Cannot save edit."
      );
      return;
    }
    if (editedTitle.trim() === "") {
      console.error("Task title cannot be empty.");
      // You might want to display a user-friendly error message here
      return;
    }
    try {
      const appId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (!appId) {
        console.error("Firebase Project ID is missing.");
        return;
      }
      const taskRef = doc(
        db,
        `artifacts/${appId}/users/${userId}/tasks`,
        editingTask.id
      );
      await updateDoc(taskRef, {
        title: editedTitle.trim(),
        description: editedDescription.trim(),
      });
      console.log(`Task ${editingTask.id} updated successfully.`);
      setEditingTask(null); // Exit editing mode
      setEditedTitle("");
      setEditedDescription("");
    } catch (err) {
      console.error("Error saving task edit:", err);
    }
  };

  // NEW: handleCancelEdit to exit editing mode without saving
  const handleCancelEdit = () => {
    setEditingTask(null); // Exit editing mode
    setEditedTitle("");
    setEditedDescription("");
  };

  const handleDeleteTask = async (id: string) => {
    if (!db || !userId) {
      console.error(
        "Firestore DB or userId not available. Cannot delete task."
      );
      return;
    }
    try {
      const appId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (!appId) {
        console.error("Firebase Project ID is missing.");
        return;
      }
      const taskRef = doc(db, `artifacts/${appId}/users/${userId}/tasks`, id);
      await deleteDoc(taskRef);
      console.log(`Task ${id} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // --- Filtering Logic ---
  const filteredTasks = useMemo(() => {
    if (activeFilter === "all") {
      return tasks;
    } else {
      return tasks.filter((task) => task.status === activeFilter);
    }
  }, [activeFilter, tasks]);

  // If not authenticated, show the login UI
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center w-full  p-4 sm:p-6  rounded-xl shadow-lg ">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Welcome to Your Todo App!
        </h2>
        <p className="text-gray-600 mb-6">
          Please sign in to manage your tasks.
        </p>
        <GoogleSignInButton onClick={signInWithGoogle} disabled={loading} />
      </div>
    );
  }

  return (
    <div>
      {/* <div className="flex justify-between items-center mb-6 py-2 px-4 bg-white rounded-lg shadow-sm">
        {userId && (
          <div className="text-gray-600 text-sm">
            Logged in as:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded-md text-xs">
              {userId}
            </span>
          </div>
        )}
        <button
          onClick={signOutUser}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200 shadow-sm"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div> */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Display User ID (managed by useFirebase hook) */}
        {/* {userId && (
          <div className="text-center text-gray-600 text-sm mb-4">
            Logged in as:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {userId}
            </span>
          </div>
        )} */}

        {/* Loading and Error Messages (managed by useFirebase hook) */}
        {loading && (
          <div className="text-center text-blue-500 mb-4">
            Initializing Firebase...
          </div>
        )}
        {error && <div className="text-center text-red-500 mb-4">{error}</div>}
        {!isAuthenticated && !loading && !error && (
          <div className="text-center text-yellow-500 mb-4">
            Authenticating...
          </div>
        )}
      </div>

      <h1 className="mb-6  md:hidden flex justify-center">
        Welcome {user?.displayName}
      </h1>
      <TaskCount
        tasks={tasks} // Pass all tasks for counting
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />
      {/* Add Task Form */}
      <AddTask onAddTask={handleAddTask} />
      {/* NEW: Edit Task Form - Appears when a task is selected for editing */}
      {isAuthenticated &&
        editingTask && ( // <--- THIS IS THE EDIT INTERFACE
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-full mx-auto mt-4 border-2 border-blue-400">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Task
            </h2>
            <div className="mb-4">
              <input
                type="text"
                className="border rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Task Title"
                value={editedTitle} // Bound to editedTitle state
                onChange={(e) => setEditedTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                className="border rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Task Description (optional)"
                value={editedDescription} // Bound to editedDescription state
                onChange={(e) => setEditedDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelEdit} // Calls function to exit edit mode
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit} // Calls function to save changes to Firestore
                disabled={editedTitle.trim() === ""} // Disable if title is empty
                className={`bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  editedTitle.trim() === ""
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

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
