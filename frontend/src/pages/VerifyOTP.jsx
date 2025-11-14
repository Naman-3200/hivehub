import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../lib/api";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const { email, name, password } = location.state || {};

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp");

  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }

    // Start with 60 second cooldown
    setResendCooldown(60);
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (otpValue && otpValue.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [otpValue, handleSubmit]);

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/api/auth/verify-otp", {
        email,
        otp: data.otp,
        name,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role);

        // Show success message
        alert("✅ Email verified successfully! Welcome to HiveeHub!");
        navigate("/");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert(error.response?.data?.message || "Invalid OTP. Please try again.");
      setValue("otp", ""); // Clear OTP input
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      const response = await api.post("/api/auth/resend-otp", { email });

      if (response.data.success) {
        alert("✅ OTP resent successfully!");
        setResendCooldown(60);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      const retryAfter = error.response?.data?.retryAfter;
      if (retryAfter) {
        setResendCooldown(retryAfter);
        alert(
          `Please wait ${retryAfter} seconds before requesting another OTP.`
        );
      } else {
        alert(error.response?.data?.message || "Failed to resend OTP");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setValue("otp", value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Check your email
          </h2>
          <p className="text-gray-600 mt-2">We sent a verification code to</p>
          <p className="text-blue-600 font-medium">{email}</p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter verification code
            </label>
            <input
              {...register("otp")}
              type="text"
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              onChange={handleOTPChange}
              className="w-full text-center text-2xl font-mono tracking-[0.5em] py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              autoComplete="one-time-code"
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otpValue?.length !== 6}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOTP}
              disabled={resendCooldown > 0 || isResending}
              className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending
                ? "Sending..."
                : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend"}
            </button>
          </p>
        </div>

        {/* Back to register */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/register")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to registration
          </button>
        </div>
      </div>
    </div>
  );
}
