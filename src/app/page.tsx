import TaskCount from "@/components/TaskCount";
import TaskListAndFilters from "@/components/TaskListAndFilters";

export default function Home() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-8 ">
      {/* <AddTask /> */}
      {/* <FilterButtons /> */}
      {/* <TaskCard /> */}
      <TaskListAndFilters />
      {/* <div className="flex justify-center items-center text-gray-500 mb-5">
        <h3>Developed by Abrar Tanim</h3>
      </div> */}
    </div>
  );
}
