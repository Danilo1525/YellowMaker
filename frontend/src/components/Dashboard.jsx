import React from "react";
import FileUpload from "./FileUpload";
import TableBuilder from "./TableBuilder";
import DashboardEditor from "./DashboardEditor";

export default function Dashboard({ onLogout }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600">
            YellowMaker Dashboard
          </h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <DashboardEditor />
            </div>
            <FileUpload />
            <TableBuilder />
          </div>
        </div>
      </main>
    </div>
  );
}
