import React from "react";
import { Link } from "react-router-dom";

export default function AuthFailure() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center">
        <div className="mb-6">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Authentication Failed
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't sign you in with Google. Please try again or use
          email/password.
        </p>

        <div className="space-y-3">
          <Link
            to="/login"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition inline-block"
          >
            Try Again
          </Link>
          <Link
            to="/register"
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition inline-block"
          >
            Create Account Instead
          </Link>
        </div>
      </div>
    </div>
  );
}
