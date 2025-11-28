import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { generateOTP, sendOTPEmail, sendResetPasswordEmail } from "../services/EmailService.js";

import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();


console.log("JWT Secret Loaded:", process.env.JWT_SECRET);


// Send OTP for email verification
export const sendOTP = async (req, res) => {
  try {
    const { email, name } = req.body;

    console.log("📧 Send OTP request:", { email, name }); // Debug log

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    console.log(
      "🔍 Existing user:",
      existingUser
        ? {
            email: existingUser.email,
            isVerified: existingUser.isVerified,
            hasOtp: !!existingUser.otp,
          }
        : "None"
    ); // Debug log

    // Check if user exists and is already verified
    if (existingUser && existingUser.isVerified === true) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified. Please sign in instead.",
      });
    }

    // Rate limiting: Check if OTP was sent recently
    if (existingUser && existingUser.lastOtpSent) {
      const timeSinceLastOtp = Date.now() - existingUser.lastOtpSent.getTime();
      const oneMinute = 60 * 1000;

      if (timeSinceLastOtp < oneMinute) {
        return res.status(429).json({
          success: false,
          message: "Please wait before requesting another OTP",
          retryAfter: Math.ceil((oneMinute - timeSinceLastOtp) / 1000),
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log("🔑 Generated OTP:", otp); // Debug log (remove in production)

    // Update or create user with OTP and ensure isVerified is false
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name: name, // Update name
          otp,
          otpExpires,
          lastOtpSent: new Date(),
          isVerified: false, // Explicitly set to false
          role: "user", // Ensure role is set for new users
        },
        $inc: { otpAttempts: 1 },
      },
      { upsert: true, new: true }
    );

    console.log("💾 User updated:", {
      email: updatedUser.email,
      isVerified: updatedUser.isVerified,
      hasOtp: !!updatedUser.otp,
    }); // Debug log

    // Send OTP email
    await sendOTPEmail(email, name, otp);

    console.log(`✅ OTP sent to ${email}: ${otp}`); // Remove in production

    res.json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("❌ Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message, // Add error details for debugging
    });
  }
};

// Verify OTP and complete registration
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, password, name } = req.body;

    console.log("🔍 Verify OTP request:", {
      email,
      otp: otp ? "***" : undefined,
    }); // Debug log

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find user with matching email and OTP
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: new Date() },
    });

    if (!user) {
      console.log("❌ Invalid or expired OTP for:", email); // Debug log
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Check if user exceeded OTP attempts
    if (user.otpAttempts > 5) {
      return res.status(429).json({
        success: false,
        message: "Too many OTP attempts. Please request a new OTP.",
      });
    }

    // Complete user registration if password provided
    if (password && name) {
      const bcrypt = await import("bcrypt");
      const hashedPassword = await bcrypt.hash(password, 10);

      user.name = name;
      user.password = hashedPassword;
      user.role = user.role || "user"; // Set default role if not set
    }

    // Mark user as verified and clear OTP data
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    user.lastOtpSent = undefined;

    await user.save();

    console.log("✅ User verified successfully:", user.email); // Debug log

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or already verified",
      });
    }

    // Rate limiting
    if (user.lastOtpSent) {
      const timeSinceLastOtp = Date.now() - user.lastOtpSent.getTime();
      const oneMinute = 60 * 1000;

      if (timeSinceLastOtp < oneMinute) {
        return res.status(429).json({
          success: false,
          message: "Please wait before requesting another OTP",
          retryAfter: Math.ceil((oneMinute - timeSinceLastOtp) / 1000),
        });
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    user.lastOtpSent = new Date();
    user.otpAttempts = 0; // Reset attempts

    await user.save();
    await sendOTPEmail(email, user.name, otp);

    console.log(`✅ OTP resent to ${email}: ${otp}`); // Remove in production

    res.json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
    });
  }
};

// export const googleAuthSuccess = async (req, res) => {
//   try {
//     if (!req.user) {
//       console.log("No user in request");
//       return res.redirect(`${process.env.CLIENT_URL}/auth/failure`);
//     }

//     const token = jwt.sign(
//       {
//         id: req.user._id,
//         email: req.user.email,
//         role: req.user.role, // Added role field
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     console.log("Token generated:", token ? "Yes" : "No");

//     const redirectURL = `${process.env.CLIENT_URL}/auth-success?token=${token}`;
//     console.log("Redirecting to:", redirectURL);

//     res.redirect(redirectURL);
//   } catch (error) {
//     console.error("Google auth success error:", error);
//     res.redirect(`${process.env.CLIENT_URL}/auth/failure`);
//   }
// };


export const googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user;
    console.log("🔍 Google Auth Success - User:", user);
    
    if (!user) {
      return res.status(400).json({ success: false, message: "Authentication failed" });
    }

    const jwtSecret = process.env.JWT_SECRET || "ndujrijrfij";
    console.log("🔍 JWT Secret in googleAuthSuccess:", jwtSecret);
    console.log("🔍 JWT Secret length:", jwtSecret.length);

    // 🚨 FIX: Convert ObjectId to string
    const tokenPayload = { 
      id: user._id.toString(), // Convert ObjectId to string!
      email: user.email, 
      role: user.role || 'user' 
    };
    
    console.log("🔍 Token payload (after conversion):", tokenPayload);

    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: "7d" });

    console.log("🔍 Generated token length:", token.length);
    console.log("🔍 Token first 50 chars:", token.substring(0, 231));

    // Test verification
    try {
      const testVerify = jwt.verify(token, jwtSecret);
      console.log("✅ Token verification test PASSED:", testVerify);
    } catch (testError) {
      console.log("❌ Token verification test FAILED:", testError.message);
    }

    // Set cookie as backup
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendURL}/auth-success?token=${token}`);
    
  } catch (error) {
    console.error("🔍 Google auth error:", error);
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173/";
    res.redirect(`${frontendURL}/login?error=auth_failed`);
  }
};

export const getAuthStatus = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    console.log("🔍 Auth Status - Token received:", token ? `${token.substring(0, 30)}...` : "null");
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided" 
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "dev-secret";
    console.log("🔍 Auth Status - JWT Secret:", jwtSecret);

    const decoded = jwt.verify(token, jwtSecret);
    console.log("🔍 Auth Status - Decoded token:", decoded);
    
    // Make sure to import your User model
    const user = await User.findById(decoded.id).select('-password');
    console.log("🔍 Auth Status - User found:", !!user);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({
      success: true,
      user: user,
      token: token
    });
  } catch (error) {
    console.error("🔍 Auth status error:", error.name, error.message);
    res.status(403).json({ 
      success: false, 
      message: "Invalid token",
      error: error.message
    });
  }
};

export const googleAuthFailure = (req, res) => {
  console.log("Google auth failure callback hit");
  res.redirect(`${process.env.CLIENT_URL}/auth/failure`);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
};

// export const getAuthStatus = (req, res) => {
//   console.log("🔍 Auth status check - User:", req.user ? "Exists" : "None");

//   if (req.user) {
//     res.json({
//       success: true,
//       user: {
//         id: req.user._id,
//         name: req.user.name,
//         email: req.user.email,
//         profilePicture: req.user.profilePicture,
//       },
//     });
//   } else {
//     res.status(401).json({
//       success: false,
//       message: "Not authenticated",
//     });
//   }
// };

// ↑ add sendResetPasswordEmail inside EmailService.js

// ===========================
// Forgot Password (send reset link)
// ===========================


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate reset token (random string)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Save to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Create reset URL (frontend route)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Send email via your EmailService
    await sendResetPasswordEmail(user.email, user.name, resetUrl);

    res.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send password reset link",
    });
  }
};

// ===========================
// Reset Password (via token)
// ===========================
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }, // check not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Hash new password
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};
