import express from "express";
import { getUserProfile, updateUserProfile } from "../controller/settings.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js"; // assumes JWT protection

const router = express.Router();

// Protected routes
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);

export default router;
