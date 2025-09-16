import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/registerSchema";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data) {
    try {
      const res = await axios.post("http://localhost:8000/user/register", data);
      // server returns created user but no token; we'll still set demo token or use server token if available
      const token = res.data?.token || "demo-token";
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded shadow"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Register
        </h2>

        <label className="block mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-300">Name</span>
          <input
            {...register("name")}
            name="name"
            type="text"
            className="mt-1 block w-full rounded border-gray-200 bg-gray-50 p-2 text-gray-800"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Email
          </span>
          <input
            {...register("email")}
            name="email"
            type="email"
            className="mt-1 block w-full rounded border-gray-200 bg-gray-50 p-2 text-gray-800"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Password
          </span>
          <input
            {...register("password")}
            name="password"
            type="password"
            className="mt-1 block w-full rounded border-gray-200 bg-gray-50 p-2 text-gray-800"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </label>

        <label className="block mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Confirm Password
          </span>
          <input
            {...register("confirmPassword")}
            name="confirmPassword"
            type="password"
            className="mt-1 block w-full rounded border-gray-200 bg-gray-50 p-2 text-gray-800"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </label>

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Create account
        </button>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
