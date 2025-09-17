import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/loginSchema";
import api from "../lib/api";

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    try {
      const res = await api.post("/user/login", data);
      const token = res.data?.token;
      const user = res.data?.user;
      if (token) {
        localStorage.setItem("token", token);
        if (user) {
          localStorage.setItem("role", user.role);
        }
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            <span>⧉</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-gray-900">
          Sign in to Hive Hub
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Welcome back! Sign in to your account below.
        </p>
        <div className="mt-6 flex gap-3"> <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-50"> <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-3 h-5 mr-2" /> Google </button> </div>
        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              className="block mt-3 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              className="block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot your password?
          </a>
        </div>

        {/* Register */}
        <div className="mt-8 border-t pt-4 text-center">
          <p className="text-sm text-gray-600">
            New to Dropship?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>


  );
}
