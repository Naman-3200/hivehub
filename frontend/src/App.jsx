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
import StorePage from "./pages/Landing/StorePage"; 
import WebEditor from "./pages/Landing/WebEditor";
import StoreHome from "./pages/Landing/StoreHome";
import StoreLogin from "./pages/Landing/StoreLogin";
import StoreRegister from "./pages/Landing/StoreRegister";
import Dashboard from "./pages/Landing/Dashboard";
import PaymentSuccess from "./pages/Landing/PaymentSuccess";
import CheckoutButton from "./pages/Landing/CheckoutButton";
import SuperAdminUsers from "./pages/SuperAdmin/SuperAdminUsers";
import StoreUsersPage from "./pages/StoreUsersPage";
import ProtectedRoutes from "./pages/Landing/ProtectedRoute";
import Community from "./pages/Landing/Community";
import InventoryPage from "./pages/Inventory/InventoryPage";
import StoresPage from "./pages/StoresPage";
import ProductsPage from "./pages/ProductsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import CreateStorePage from "./pages/CreateStorePage";


// import { monitorLocalStorage } from "./pages/monitorlocalStorage";
function App() {
    // monitorLocalStorage();
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/dashboard" element={<ProtectedRoute><DropshipDashboard /></ProtectedRoute>} />
//       <Route path="/store/:slug" element={<StorePage />} />
//       <Route path="/builder/:storeId" element={<WebEditor />} />
//       <Route path="/dashboardpage" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//       <Route path="/checkout" element={<ProtectedRoute><CheckoutButton /></ProtectedRoute>} />
//       <Route path="/community"   element= {<ProtectedRoute><Community/> </ProtectedRoute>} />
//         <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />   {/* ✅ new route */}




//       <Route path="/store/:storeId" element={<StoreHome />} />
//         <Route path="/store-login/:storeId" element={<StoreLogin />} />
//         <Route path="/store-register/:storeId" element={<StoreRegister />} />
//         <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />

//         <Route
//   path="/superadmin-dashboard"
//   element={
//     <ProtectedRoutes allowedRoles={["superadmin"]}>
//       <SuperAdminDashboard />
//     </ProtectedRoutes>
//   }
// />

// <Route
//   path="/superadmin-users"
//   element={
//     <ProtectedRoutes allowedRoles={["superadmin"]}>
//       <SuperAdminUsers />
//     </ProtectedRoutes>
//   }
// />

// <Route
//   path="/store-users"
//   element={
//     <ProtectedRoutes allowedRoles={["admin", "superadmin"]}>
//       <StoreUsersPage />
//     </ProtectedRoutes>
//   }
// />

            

//       <Route
//         path="/user-dashboard"
//         element={
//           <ProtectedRoute>
//             <ProductDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/superadmin"
//         element={
//           <ProtectedRoute allowedRoles={["superadmin"]}>
//             <SuperAdminDashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />
//       <Route path="/reset-password" element={<ResetPassword />} />

//       <Route path="/verify-otp" element={<VerifyOTP />} />
//       <Route path="/auth-success" element={<AuthSuccess />} />
//       <Route path="/auth/failure" element={<AuthFailure />} />
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );

return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="/auth/failure" element={<AuthFailure />} />

      {/* Dashboard for user */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DropshipDashboard />
          </ProtectedRoute>
        }
      />

      {/* User Pages (separated pages) */}
      <Route
        path="/stores"
        element={
          <ProtectedRoute>
            <StoresPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      {/* <Route
        path="/create-store"
        element={
          <ProtectedRoute>
            <CreateStorePage
            />
          </ProtectedRoute>
        }
      /> */}


      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        }
      />

      {/* Storefront Routes */}
      <Route path="/store/:slug" element={<StorePage />} />
      <Route path="/store/:storeId" element={<StoreHome />} />
      <Route path="/store-login/:storeId" element={<StoreLogin />} />
      <Route path="/store-register/:storeId" element={<StoreRegister />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutButton />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-success"
        element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />

      {/* Editor */}
      <Route path="/builder/:storeId" element={<WebEditor />} />

      {/* Admin Routes */}
      <Route
        path="/store-users"
        element={
          <ProtectedRoutes allowedRoles={["admin", "superadmin"]}>
            <StoreUsersPage />
          </ProtectedRoutes>
        }
      />

      {/* Superadmin Routes */}
      <Route
        path="/superadmin-dashboard"
        element={
          <ProtectedRoutes allowedRoles={["superadmin"]}>
            <SuperAdminDashboard />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/superadmin-users"
        element={
          <ProtectedRoutes allowedRoles={["superadmin"]}>
            <SuperAdminUsers />
          </ProtectedRoutes>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
