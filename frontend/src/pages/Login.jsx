import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/loginSchema";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    try {
      const res = await axios.post("http://localhost:8000/user/login", data);
      const token = res.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded shadow"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Login
        </h2>

        <label className="block mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Email
          </span>
          <input
            {...register("email")}
            type="email"
            className="mt-1 block w-full rounded border-gray-200 bg-gray-50 p-2 text-gray-800"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </label>

        <label className="block mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Password
          </span>
          <input
            {...register("password")}
            type="password"
            className="mt-1 block w-full rounded border-gray-200 bg-gray-50 p-2 text-gray-800"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </label>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign in
        </button>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
