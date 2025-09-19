/* eslint-disable no-unused-vars */
import React, { createContext, useEffect, useState } from "react";
import api from "../lib/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // Try regular auth first
        let res = await api.get("/user/me");
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem("role", res.data.user.role || "user");
        } else {
          throw new Error("No valid auth");
        }
      } catch (error) {
        // If regular auth fails, try Google auth status
        try {
          const googleRes = await api.get("/api/auth/status");
          if (googleRes.data.success) {
            setUser(googleRes.data.user);
            localStorage.setItem("role", googleRes.data.user.role || "user");
          } else {
            throw new Error("No valid auth");
          }
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
