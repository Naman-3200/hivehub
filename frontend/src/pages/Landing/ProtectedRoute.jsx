// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const role =
    JSON.parse(localStorage.getItem("user") || "{}")?.role ||
    localStorage.getItem("role") ||
    "user";

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
