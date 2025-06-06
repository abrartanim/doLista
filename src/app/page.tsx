import AddTask from "@/components/AddTask";
import TaskCount from "@/components/TaskCount";

import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-8 ">
      <TaskCount />
      <AddTask />
      <h1>Hello</h1>
    </div>
  );
}
