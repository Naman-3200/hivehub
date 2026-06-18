import React from "react";
import { Link, Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required role: {allowedRoles.join(" or ")} | Your role:{" "}
            {userRole || "none"}
          </p>
          {/* <Navigate to="/" replace /> */}
          <Link
            to={"/"}
            className="mt-3 text-blue-600 hover:text-blue-700 underline"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
