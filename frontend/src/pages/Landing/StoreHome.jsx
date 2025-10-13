import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const StoreHome = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("storeUser"));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Store {storeId}
      </h1>
      {user ? (
        <>
          <p className="mb-2">Hi, {user.name} 👋</p>
          <button
            onClick={() => {
              localStorage.removeItem("storeUser");
              localStorage.removeItem("storeUserToken");
              window.location.reload();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </>
      ) : (
        <div className="space-x-3">
          <button
            onClick={() => navigate(`/store/${storeId}/login`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Login
          </button>
          <button
            onClick={() => navigate(`/store/${storeId}/register`)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreHome;
