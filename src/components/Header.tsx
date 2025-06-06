import React from "react";
import MenuItem from "./MenuItem";
import { MdAccountCircle } from "react-icons/md";

export default function Header() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex  items-center justify-between ">
      <div className="text-center mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold">
          <span className="bg-blue-500 text-white rounded-full px-2 py-1">
            Do
          </span>
          Lista
        </h1>
        <h2 className="mt-2 text-xl sm:text-xl text-gray-600">
          Organize your tasks efficiently
        </h2>
      </div>
      <div className=" items-center absolute right-4 top-4">
        <MenuItem
          account_name="Abrar Tanim"
          account_picture={<MdAccountCircle className="text-black text-4xl" />}
        />
      </div>
    </div>
  );
}
