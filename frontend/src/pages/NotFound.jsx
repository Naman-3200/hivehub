import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4 bg-white dark:bg-gray-900">
      <h1 className="text-6xl font-extrabold text-gray-800 dark:text-gray-100">
        404
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Page not found.
      </p>
      <Link
        to="/"
        className="mt-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
      >
        Go back home
      </Link>
    </div>
  );
}
