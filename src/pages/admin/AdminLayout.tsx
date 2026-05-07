import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";

function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed z-30 inset-y-0 left-0 transform md:relative md:translate-x-0 transition-all duration-300 ease-in-out w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-center h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
            <div className="text-center">
              <h1 className="text-white font-bold text-2xl tracking-wide">
                Digital Dookan
              </h1>
              <p className="text-blue-100 text-xs font-medium mt-1">Admin Dashboard</p>
            </div>
          </div>
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Modern Header */}
          <header className="h-20 bg-white border-b border-gray-200 shadow-sm">
            <div className="h-full px-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Hamburger button */}
                <button
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? (
                    <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
                
                {/* Search bar
                <div className="hidden md:flex items-center">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>*/}
                </div>
              

              <div className="flex items-center space-x-4">
                {/* Logout Button */}
                <div className="flex items-center pl-4 border-l border-gray-300">
                  <button 
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/login";
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-semibold text-sm">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
