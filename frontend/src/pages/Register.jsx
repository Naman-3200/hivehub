import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/registerSchema";
import api from "../lib/api";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data) {
    try {
      const res = await api.post("/user/register", data);
      const token = res.data?.token;
      const user = res.data?.user;
      if (!token) throw new Error("No token returned from server");
      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("role", user.role);
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            {/* replace with your SVG/logo */}
            <span>⧉</span>
          </div>
        </div>

        {/* Title + subtitle */}
        <h2 className="text-center text-xl font-semibold text-gray-900">
          Create your account
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Get started with Dropship in a minute.
        </p>
        {/* 
        Social auth
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="w-1/2 flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Google
          </button>
          <button
            type="button"
            className="w-1/2 flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/303128/apple-logo.svg"
              alt="Apple"
              className="w-5 h-5 mr-2"
            />
            Apple
          </button>
        </div> */}

        {/* Divider */}
        {/* <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">or sign up with email</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div> */}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("name")}
              type="text"
              placeholder="Full Name"
              className="block mt-3 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              className="block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              className="block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isSubmitting ? "Creating…" : "Create account"}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
