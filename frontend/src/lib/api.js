import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://hivehub-1.onrender.com",
  // withCredentials: true, // sends cookies automatically
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Token expired - try refresh or redirect to login
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
