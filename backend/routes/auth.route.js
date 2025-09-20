import express from "express";
import passport from "../config/passport.js";
import {
  googleAuthSuccess,
  googleAuthFailure,
  logout,
  getAuthStatus,
  verifyOTP,
  resendOTP,
  sendOTP,
} from "../controller/auth.controller.js";

const router = express.Router();

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/failure",
    session: false,
  }),
  googleAuthSuccess
);

router.get("/failure", googleAuthFailure);
router.post("/logout", logout);
router.get("/status", getAuthStatus);

// OTP routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

export default router;
