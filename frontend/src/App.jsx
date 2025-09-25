import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import ProductDashboard from "./components/UserDashboard";
import AuthSuccess from "./pages/AuthSuccess";
import AuthFailure from "./pages/AuthFailure";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DropshipDashboard from "./pages/Landing/DropshipDashboard";
// import { monitorLocalStorage } from "./pages/monitorlocalStorage";
function App() {
    // monitorLocalStorage();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<DropshipDashboard />} />
            

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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="/auth/failure" element={<AuthFailure />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
