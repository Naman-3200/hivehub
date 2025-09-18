import React, { createContext, useEffect, useState } from "react";
import api from "../lib/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// this function basically checks if the user is verified or not
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
        const res = await api.get("/user/me");
        setUser(res.data.user);
        localStorage.setItem("role", res.data.user.role || "user");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
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
