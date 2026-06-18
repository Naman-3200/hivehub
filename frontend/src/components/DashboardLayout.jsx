import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import api from "../lib/api";

export default function DashboardLayout({ children, activeTab, onTabChange }) {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "SuperAdmin",
    email: "",
    role: "superadmin",
  });

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/user/me");
        if (response.data.user) {
          setUserInfo({
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        // If failed, keep default values or redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const sidebarItems = [
    { id: "users", label: "User Management", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 bg-[#F9FBFF] bg-opacity-5 border-r border-blue-200 transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        ${sidebarCollapsed ? "w-20" : "w-64"}
      `}
      >
        {/* Logo Section */}
        <div
          className={`flex items-center h-16 px-4 border-b border-blue-200 ${
            sidebarCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center">
            {/* Blue Logo Icon */}
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">HiveHub</h1>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button */}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-blue-100 transition-colors flex-shrink-0"
            >
              <PanelLeftClose className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Expand Button when collapsed */}
        {sidebarCollapsed && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md hover:bg-blue-100 transition-colors"
            >
              <PanelLeftOpen className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        )}

        {/* Close Button - Mobile */}
        {mobileMenuOpen && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-1 rounded hover:bg-blue-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Navigation */}
        <nav className="mt-8">
          <div className={`${sidebarCollapsed ? "px-2" : "px-4"} space-y-2`}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      sidebarCollapsed
                        ? "px-3 py-3 justify-center"
                        : "px-3 py-2.5"
                    }
                    ${
                      isActive
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                    }
                  `}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? "text-blue-700" : "text-gray-500"
                    } ${sidebarCollapsed ? "" : "mr-3"}`}
                  />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-200">
          <div className={`space-y-2`}>
            <button
              onClick={handleGoHome}
              className={`
                w-full flex items-center text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors
                ${sidebarCollapsed ? "px-3 py-3 justify-center" : "px-3 py-2.5"}
              `}
              title={sidebarCollapsed ? "Go to Home" : undefined}
            >
              <Home className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
              {!sidebarCollapsed && "Go to Home"}
            </button>
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors
                ${sidebarCollapsed ? "px-3 py-3 justify-center" : "px-3 py-2.5"}
              `}
              title={sidebarCollapsed ? "Logout" : undefined}
            >
              <LogOut className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
              {!sidebarCollapsed && "Logout"}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeTab === "users" && "User Management"}
                  {activeTab === "analytics" && "Analytics Dashboard"}
                  {activeTab === "settings" && "System Settings"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {activeTab === "users" &&
                    "Manage users and their permissions across the platform"}
                  {activeTab === "analytics" &&
                    "Monitor key metrics and system performance"}
                  {activeTab === "settings" &&
                    "Configure system preferences and security"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {userInfo.name}
                    </p>
                    <p className="text-xs text-gray-500">{userInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
