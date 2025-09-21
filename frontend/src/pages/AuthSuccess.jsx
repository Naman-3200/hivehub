import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("AuthSuccess: Checking for token...");

    if (token) {
      console.log("✅ AuthSuccess: Token found. Saving to localStorage.");
      localStorage.setItem("token", token);
      window.location.href = "/user-dashboard";
    } else {
      console.error(
        "❌ AuthSuccess: No token found in URL. Redirecting to failure."
      );
      navigate("/auth/failure");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">
          Finalizing authentication...
        </p>
      </div>
    </div>
  );
}
