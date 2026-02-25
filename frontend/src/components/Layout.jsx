import React, { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  FolderOpenDot,
  LogOut,
  User,
} from "lucide-react";

export default function Layout({
  children,
  onLogout,
  currentView,
  setCurrentView,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Editor", view: "editor", icon: LayoutDashboard },
    { name: "Management", view: "management", icon: FolderOpenDot },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900 border-b border-gray-800">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              YellowMaker
            </h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setCurrentView(item.view)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors ${
                    currentView === item.view
                      ? "bg-gray-800 text-yellow-500"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      currentView === item.view
                        ? "text-yellow-500"
                        : "text-gray-400 group-hover:text-gray-300"
                    }`}
                  />
                  {item.name}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-800">
              <button
                onClick={onLogout}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-600 hover:text-white w-full transition-colors"
              >
                <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-white" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Column */}
      <div className="md:pl-64 flex flex-col flex-1 w-full">
        {/* Navbar for Mobile & Desktop top bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 md:hidden hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-end items-center">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 text-yellow-700 p-2 rounded-full">
                  <User className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  Workspace
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-900 text-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                  YellowMaker
                </h1>
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setCurrentView(item.view);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full transition-colors ${
                        currentView === item.view
                          ? "bg-gray-800 text-yellow-500"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <item.icon
                        className={`mr-4 flex-shrink-0 h-6 w-6 ${
                          currentView === item.view
                            ? "text-yellow-500"
                            : "text-gray-400 group-hover:text-gray-300"
                        }`}
                      />
                      {item.name}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="group flex items-center px-2 py-2 mt-4 text-base font-medium rounded-md text-red-400 w-full hover:bg-gray-700 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="mr-4 flex-shrink-0 h-6 w-6" />
                    Logout
                  </button>
                </nav>
              </div>
            </div>
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
