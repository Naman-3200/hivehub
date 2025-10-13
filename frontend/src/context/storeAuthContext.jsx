import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContexts = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const baseURL =  "https://hivehub-1.onrender.com";

  useEffect(() => {
    if (token) {
      // Optionally revalidate token by calling /api/auth/me
      axios
        .get(`${baseURL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch(() => {
          // token invalid => logout
          logout();
        });
    }
  }, [token]);

  const register = async (name, email, password) => {
    const res = await axios.post(`${baseURL}/api/auth/register`, { name, email, password });
    if (res.data?.token) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${baseURL}/api/auth/login`, { email, password });
    if (res.data?.token) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Axios instance with auth header
  const authAxios = axios.create();
  authAxios.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};
