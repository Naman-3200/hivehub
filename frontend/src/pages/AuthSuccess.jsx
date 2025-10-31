// // import React, { useEffect } from "react";
// // import { useNavigate, useSearchParams } from "react-router-dom";

// // export default function AuthSuccess() {
// //   const navigate = useNavigate();
// //   const [searchParams] = useSearchParams();

// //   useEffect(() => {
// //     const token = searchParams.get("token");
    
// //     console.log("AuthSuccess: Checking for token...");

// //     if (token) {
// //       console.log("✅ AuthSuccess: Token found. Saving to localStorage.");
// //       localStorage.setItem("token", token);
// //       navigate("/user-dashboard", { replace: true });
// //     } else {
// //       console.error(
// //         "❌ AuthSuccess: No token found in URL. Redirecting to failure."
// //       );
// //       navigate("/auth/failure");
// //     }
// //   }, [searchParams, navigate]);

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //       <div className="text-center">
// //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
// //         <p className="mt-4 text-lg text-gray-600">
// //           Finalizing authentication...
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }






// import React, { useEffect, useRef } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// export default function AuthSuccess() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const hasProcessed = useRef(false);

//   useEffect(() => {
//     // Prevent double processing in Strict Mode
//     if (hasProcessed.current) {
//       return;
//     }
//     hasProcessed.current = true;

//     console.log("🔍 AuthSuccess: Component mounted - processing once");
    
//     const token = searchParams.get("token");
//     console.log("🔍 AuthSuccess: Token from URL:", token ? "Present" : "Missing");

//     if (token) {
//       try {
//         console.log("✅ AuthSuccess: Processing token...");
        
//         // Decode JWT to get user role
//         const tokenParts = token.split('.');
//         if (tokenParts.length !== 3) {
//           throw new Error("Invalid JWT token format");
//         }

//         const payload = JSON.parse(atob(tokenParts[1]));
//         console.log("🔍 AuthSuccess: Decoded payload:", payload);

//         // Store token and role immediately
//         localStorage.setItem("token", token);
//         console.log("💾 AuthSuccess: Token stored");
        
//         if (payload.role) {
//           localStorage.setItem("role", payload.role);
//           console.log("💾 AuthSuccess: Role stored:", payload.role);
//         }

//         // Navigate immediately to avoid race condition with AuthContext
//         console.log("🚀 AuthSuccess: Navigating immediately to dashboard...");
//         navigate("/dashboard", { replace: true });

//       } catch (error) {
//         console.error("❌ AuthSuccess: Error processing token:", error);
//         navigate("/auth/failure", { replace: true });
//       }
//     } else {
//       console.error("❌ AuthSuccess: No token found in URL");
//       navigate("/auth/failure", { replace: true });
//     }
//   }, [searchParams, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="mt-4 text-lg text-gray-600">
//           Completing authentication...
//         </p>
//       </div>
//     </div>
//   );
// }

















import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    console.log("🔍 AuthSuccess: Component mounted - processing once");
    
    const token = searchParams.get("token");
    console.log("🔍 AuthSuccess: Token from URL:", token ? "Present" : "Missing");

    if (token) {
      try {
        console.log("✅ AuthSuccess: Processing token...");
        
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          throw new Error("Invalid JWT token format");
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        console.log("🔍 AuthSuccess: Decoded payload:", payload);

        // Store data
        localStorage.setItem("token", token);
        console.log("💾 AuthSuccess: Token stored");

        // Save full user object (optional)
        localStorage.setItem("user", JSON.stringify(payload));
        console.log("💾 AuthSuccess: User stored:", payload);

        if (payload.role) {
          localStorage.setItem("role", payload.role);
          console.log("💾 AuthSuccess: Role stored:", payload.role);
        }

        // ✅ Trigger re-render in Navbar immediately
        window.dispatchEvent(new Event("storage"));

        console.log("🚀 Navigating to dashboard...");
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("❌ AuthSuccess: Error processing token:", error);
        navigate("/auth/failure", { replace: true });
      }
    } else {
      console.error("❌ AuthSuccess: No token found in URL");
      navigate("/auth/failure", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
