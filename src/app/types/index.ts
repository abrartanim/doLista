// types/index.ts

export type TaskStatus = "active" | "completed";
export type FilterType = "all" | TaskStatus; // Filter can be 'all', 'active', or 'completed'

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string; // Storing as string for simplicity, can be Date
}
