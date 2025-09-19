import { Route, Routes } from "react-router-dom"; // ⭐ Remove BrowserRouter import
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Hero from "./pages/Landing/Hero";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import ProductDashboard from "./components/UserDashboard";
import AuthSuccess from "./pages/AuthSuccess";
import AuthFailure from "./pages/AuthFailure";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <ProductDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/superadmin"
        element={
          <ProtectedRoute allowedRoles={["superadmin"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
      <Route path="/auth/failure" element={<AuthFailure />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
