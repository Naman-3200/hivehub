import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Extract token from URL query string (?token=...)
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  console.log("🔑 Token from URL:", token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Reset token is missing. Please use the link from your email.");
      return;
    }

    try {
      console.log("📨 Sending reset request:", { token, newPassword });
      const res = await axios.post("https://hivehub-1.onrender.com/api/auth/reset-password", {
        token,
        newPassword,
      });
      console.log("✅ Backend response:", res.data);

      setSuccess("Password reset successfully! Redirecting to sign in...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("❌ Reset password error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
          Reset your password
        </h2>

        {!token ? (
          <p className="text-red-600 text-center">
            ❌ Invalid or missing reset token. Please request a new password reset.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
