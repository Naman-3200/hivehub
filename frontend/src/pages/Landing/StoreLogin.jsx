import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const StoreLogin = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://hivehub-1.onrender.com/api/store-users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, storeId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("storeUserToken", data.token);
      localStorage.setItem("storeUser", JSON.stringify(data.user));
      navigate(`/store/${storeId}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {message && <p className="text-red-500 text-sm mb-2">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Login
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          New user?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate(`/store/${storeId}/register`)}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default StoreLogin;
