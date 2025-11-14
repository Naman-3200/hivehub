import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Navbar from "./pages/Landing/DashboardNavbar.jsx"; // ✅ add here if globally shown
import LandingNavbar from "./pages/Landing/Navbar.jsx";


createRoot(document.getElementById("root")).render(
 
    <BrowserRouter>
      <AuthProvider>
      <LandingNavbar />
        <App />
      </AuthProvider>
    </BrowserRouter>
);
