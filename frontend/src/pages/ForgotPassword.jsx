// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://hivehub-1.onrender.com/api/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      setSubmitted(true); // still show success message (for security)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
          Forgot your password?
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-gray-600 text-center mb-4">
              Enter your email to receive a password reset link.
            </p>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-700">
              ✅ If an account exists with that email, you’ll get a reset link shortly.
            </p>
            <a
              href="/sign-in"
              className="text-blue-600 hover:underline text-sm"
            >
              ← Back to sign in
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
