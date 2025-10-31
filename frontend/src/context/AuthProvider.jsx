import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { AuthContext } from "./authContext";
import { useNavigate } from "react-router-dom";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setLoading(false);
          return;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await api.get("/user/me");

        if (res.data && (res.data.success || res.data._id)) {
          const currentUser = res.data.user || res.data;
          setUser(currentUser);
          const userRole = currentUser.role || "user";
          setRole(userRole);
          localStorage.setItem("role", userRole);
          localStorage.setItem("user", JSON.stringify(currentUser));
          window.dispatchEvent(new Event("storage"));
        } else {
          throw new Error("Invalid user response");
        }
      } catch (error) {
        try {
            if (error.response?.status === 403 && error.response?.data?.message?.includes("disabled")) {
  alert("Your account has been disabled. Please contact support.");
  logout(); // clear token, redirect to login
  navigate("/login");
  return;
}

          delete api.defaults.headers.common["Authorization"];
          const googleRes = await api.get("/api/auth/status");

          if (googleRes.data.success && googleRes.data.user) {
            const googleUser = googleRes.data.user;
            setUser(googleUser);
            const userRole = googleUser.role || "user";
            setRole(userRole);
            localStorage.setItem("role", userRole);
            localStorage.setItem("user", JSON.stringify(googleUser));

            if (googleRes.data.token) {
              localStorage.setItem("token", googleRes.data.token);
              api.defaults.headers.common["Authorization"] = `Bearer ${googleRes.data.token}`;
            }

            window.dispatchEvent(new Event("storage"));
          } else {
            throw new Error("No valid Google auth");
          }
        } catch {
          delete api.defaults.headers.common["Authorization"];
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setRole("user");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <AuthContext.Provider value={{ user, role, setUser, setRole, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
