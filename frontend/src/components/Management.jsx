import React, { useState, useEffect } from "react";
import api from "../services/api";
import Pagination from "./Pagination";
import {
  FolderOpenDot,
  LayoutDashboard,
  FileText,
  Calendar,
  Database,
  Eye,
} from "lucide-react";

export default function Management({ onSelectDashboard }) {
  const [activeTab, setActiveTab] = useState("dashboards");
  const [dashboards, setDashboards] = useState([]);
  const [files, setFiles] = useState([]); // This will hold mocked or fetched files
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [dashboardPage, setDashboardPage] = useState(1);
  const dashboardsPerPage = 5;

  const [filePage, setFilePage] = useState(1);
  const filesPerPage = 5;

  useEffect(() => {
    if (activeTab === "dashboards") {
      fetchDashboards();
    } else {
      fetchFiles();
    }
  }, [activeTab]);

  const fetchDashboards = async () => {
    setLoading(true);
    try {
      const response = await api.get("/dashboards");
      if (response.data && response.data.data) {
        setDashboards(response.data.data);
      } else {
        setDashboards([]);
      }
    } catch (error) {
      console.error("Error fetching dashboards", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      // Mocking files endpoint structure for now if it doesn't exist, wrapped in try/catch to gracefully handle
      const response = await api.get("/files").catch(() => null);
      if (response && response.data) {
        setFiles(response.data);
      } else {
        // Mock data if no files API exists yet
        setFiles([
          {
            id: "1",
            name: "sales_data_2023.csv",
            size: "2.4 MB",
            uploadedAt: "2023-10-25",
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching files", error);
    } finally {
      setLoading(false);
    }
  };

  // Dashboard pagination logic
  const indexOfLastDashboard = dashboardPage * dashboardsPerPage;
  const indexOfFirstDashboard = indexOfLastDashboard - dashboardsPerPage;
  const currentDashboards = dashboards.slice(
    indexOfFirstDashboard,
    indexOfLastDashboard,
  );
  const totalDashboardPages = Math.ceil(dashboards.length / dashboardsPerPage);

  // File pagination logic
  const indexOfLastFile = filePage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);
  const totalFilePages = Math.ceil(files.length / filesPerPage);

  const renderDashboardsTable = () => (
    <div className="mt-4">
      {loading ? (
        <div className="text-center py-6 text-gray-500">
          Loading dashboards...
        </div>
      ) : dashboards.length === 0 ? (
        <div className="text-center py-10 bg-white border rounded-lg">
          <LayoutDashboard className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500 font-medium">No dashboards found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {currentDashboards.map((dash) => (
              <li key={dash.id}>
                <div
                  className="px-4 py-4 sm:px-6 hover:bg-yellow-50 transition-colors cursor-pointer group"
                  onClick={() => onSelectDashboard && onSelectDashboard(dash)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-yellow-600 truncate flex items-center group-hover:text-yellow-700">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      {dash.name || "Untitled Dashboard"}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex items-center space-x-3">
                      <p className="opacity-0 group-hover:opacity-100 text-xs font-semibold text-yellow-700 transition-opacity flex items-center">
                        <Eye className="w-4 h-4 mr-1" /> Open in Editor
                      </p>
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Saved
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex items-center">
                      <p className="flex items-center text-sm text-gray-500 group-hover:text-gray-700">
                        {dash.description || "No description provided."}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p>ID: {dash.id}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={dashboardPage}
            totalPages={totalDashboardPages}
            onPageChange={setDashboardPage}
          />
        </div>
      )}
    </div>
  );

  const renderFilesTable = () => (
    <div className="mt-4">
      {loading ? (
        <div className="text-center py-6 text-gray-500">Loading files...</div>
      ) : files.length === 0 ? (
        <div className="text-center py-10 bg-white border rounded-lg">
          <Database className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500 font-medium">No files uploaded yet</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {currentFiles.map((file) => (
              <li key={file.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded bg-indigo-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {file.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Database className="w-3 h-3 mr-1" /> {file.size}
                        <span className="mx-2">•</span>
                        <Calendar className="w-3 h-3 mr-1" /> {file.uploadedAt}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className="text-gray-400 hover:text-yellow-600 p-2 rounded-full hover:bg-yellow-50 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={filePage}
            totalPages={totalFilePages}
            onPageChange={setFilePage}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="mb-8 pl-4 border-l-4 border-yellow-500">
        <h1 className="text-3xl font-bold text-gray-900">Management Center</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your saved dashboards and uploaded files.
        </p>
      </div>

      <div className="mb-6">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="dashboards">Saved Dashboards</option>
            <option value="files">Uploaded Files</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("dashboards")}
                className={`${
                  activeTab === "dashboards"
                    ? "border-yellow-500 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Saved Dashboards
              </button>
              <button
                onClick={() => setActiveTab("files")}
                className={`${
                  activeTab === "files"
                    ? "border-yellow-500 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
              >
                <FolderOpenDot className="mr-2 h-5 w-5" />
                Uploaded Files
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px]">
        {activeTab === "dashboards"
          ? renderDashboardsTable()
          : renderFilesTable()}
      </div>
    </div>
  );
}
