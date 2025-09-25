// /* eslint-disable no-unused-vars */
// import React, { createContext, useEffect, useState } from "react";
// import api from "../lib/api";

// // eslint-disable-next-line react-refresh/only-export-components
// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setLoading(false);
//         return;
//       }
//       try {
//         // Try regular auth first
//         let res = await api.get("/user/me");
//         console.log("AuthContext: /user/me response:", res.data);
//         if (res.data.success) {
//           setUser(res.data.user);
//           localStorage.setItem("role", res.data.user.role || "user");
//         } else {
//           throw new Error("No valid auth");
//         }
//       } catch (error) {
//         // If regular auth fails, try Google auth status
//         try {
//           const googleRes = await api.get("/api/auth/status");
//           if (googleRes.data.success) {
//             setUser(googleRes.data.user);
//             localStorage.setItem("role", googleRes.data.user.role || "user");
//           } else {
//             throw new Error("No valid auth");
//           }
//         } catch {
//           console.log("AuthContext: Both endpoints failed, clearing auth");
//         }
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }



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
      
      console.log("AuthContext: Starting auth check");
      console.log("AuthContext: Token from localStorage:", token ? `${token.substring(0, 20)}...` : "null");
      
      if (!token) {
        console.log("AuthContext: No token found, skipping auth");
        setLoading(false);
        return;
      }

      try {
        // Log the token structure
        console.log("AuthContext: Token length:", token.length);
        console.log("AuthContext: Token starts with:", token.substring(0, 10));
        
        // Check if token has proper JWT structure (3 parts separated by dots)
        const tokenParts = token.split('.');
        console.log("AuthContext: Token parts count:", tokenParts.length);
        
        if (tokenParts.length !== 3) {
          console.log("AuthContext: Invalid JWT structure - clearing token");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setLoading(false);
          return;
        }

        // Set the token in the api headers before making the request
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log("AuthContext: Set Authorization header");
        
        // Try regular auth first
        console.log("AuthContext: Calling /user/me");
        let res = await api.get("/user/me");
        console.log("AuthContext: /user/me response:", res.data);
        
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem("role", res.data.user.role || "user");
          console.log("AuthContext: User set successfully");
        } else {
          throw new Error("No valid user data");
        }
      } catch (error) {
        console.log("AuthContext: /user/me failed:", error.response?.status, error.response?.data);
        
        // Check if it's specifically a token issue
        if (error.response?.status === 403 && error.response?.data?.message === "Invalid token") {
          console.log("AuthContext: Invalid token detected, clearing localStorage");
          // localStorage.removeItem("token");
          // localStorage.removeItem("role");
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
          setLoading(false);
          return;
        }
        
        // If regular auth fails, try Google auth status (without Authorization header)
        try {
          console.log("AuthContext: Trying /api/auth/status");
          // Remove Authorization header for this request since it's failing
          delete api.defaults.headers.common['Authorization'];
          
          const googleRes = await api.get("/api/auth/status");
          console.log("AuthContext: /api/auth/status response:", googleRes.data);
          
          if (googleRes.data.success && googleRes.data.user) {
            setUser(googleRes.data.user);
            localStorage.setItem("role", googleRes.data.user.role || "user");
            
            // If Google auth provides a token, store it
            if (googleRes.data.token) {
              console.log("AuthContext: New token received from auth status");
              localStorage.setItem("token", googleRes.data.token);
              api.defaults.headers.common['Authorization'] = `Bearer ${googleRes.data.token}`;
            }
            console.log("AuthContext: Google auth successful");
          } else {
            throw new Error("No valid Google auth");
          }
        } catch (googleError) {
          console.log("AuthContext: Google auth also failed:", googleError.response?.status, googleError.response?.data);
          console.log("AuthContext: Both endpoints failed, clearing auth");
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const logout = () => {
    console.log("AuthContext: Logging out");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}