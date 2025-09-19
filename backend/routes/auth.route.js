import express from "express";
import passport from "../config/passport.js";
import {
  googleAuthSuccess,
  googleAuthFailure,
  logout,
  getAuthStatus,
} from "../controller/auth.controller.js";

const router = express.Router();

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

export default router;
