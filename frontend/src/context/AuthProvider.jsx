// import React, { useEffect, useState } from "react";
// import api from "../lib/api";
// import { AuthContext } from "./authContext";
// import { useNavigate } from "react-router-dom";


// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState("user");
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     async function load() {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const tokenParts = token.split(".");
//         if (tokenParts.length !== 3) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("role");
//           setLoading(false);
//           return;
//         }

//         api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//         const res = await api.get("/user/me");

//         if (res.data && (res.data.success || res.data._id)) {
//           const currentUser = res.data.user || res.data;
//           setUser(currentUser);
//           const userRole = currentUser.role || "user";
//           setRole(userRole);
//           localStorage.setItem("role", userRole);
//           localStorage.setItem("user", JSON.stringify(currentUser));
//           window.dispatchEvent(new Event("storage"));
//         } else {
//           throw new Error("Invalid user response");
//         }
//       } catch (error) {
//         try {
//             if (error.response?.status === 403 && error.response?.data?.message?.includes("disabled")) {
//   alert("Your account has been disabled. Please contact support.");
//   logout(); // clear token, redirect to login
//   navigate("/login");
//   return;
// }

//           delete api.defaults.headers.common["Authorization"];
//           const googleRes = await api.get("/api/auth/status");

//           if (googleRes.data.success && googleRes.data.user) {
//             const googleUser = googleRes.data.user;
//             setUser(googleUser);
//             const userRole = googleUser.role || "user";
//             setRole(userRole);
//             localStorage.setItem("role", userRole);
//             localStorage.setItem("user", JSON.stringify(googleUser));

//             if (googleRes.data.token) {
//               localStorage.setItem("token", googleRes.data.token);
//               api.defaults.headers.common["Authorization"] = `Bearer ${googleRes.data.token}`;
//             }

//             window.dispatchEvent(new Event("storage"));
//           } else {
//             throw new Error("No valid Google auth");
//           }
//         } catch {
//           delete api.defaults.headers.common["Authorization"];
//           setUser(null);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     delete api.defaults.headers.common["Authorization"];
//     setUser(null);
//     setRole("user");
//     window.dispatchEvent(new Event("storage"));
//   };

//   return (
//     <AuthContext.Provider value={{ user, role, setUser, setRole, loading, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }











import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { AuthContext } from "./authContext";
import { useNavigate } from "react-router-dom";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  // 🔥 ADD THIS — token state that actually triggers re-render
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const navigate = useNavigate();

  // 🔥 React responds instantly when token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      setRole("user");
      delete api.defaults.headers.common["Authorization"];
      return;
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token]);

  useEffect(() => {
    async function load() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setToken(null);
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
          if (
            error.response?.status === 403 &&
            error.response?.data?.message?.includes("disabled")
          ) {
            alert("Your account has been disabled. Please contact support.");
            logout();
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
              setToken(googleRes.data.token); // 🔥 update token
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
  }, [token]); // 🔥 runs again when token changes

  // ---------------------------------------
  // FIXED LOGOUT — INSTANT UI UPDATE
  // ---------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setToken(null);      // 🔥 This triggers full react update
    setUser(null);       // clear user state
    setRole("user");

    delete api.defaults.headers.common["Authorization"];

    window.dispatchEvent(new Event("storage"));

    navigate("/login");  // redirect without needing refresh
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setUser,
        setRole,
        loading,
        logout,
        token,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
