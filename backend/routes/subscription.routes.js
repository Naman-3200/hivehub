import express from "express";
import { createWhopCheckout } from "../controller/subscription.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/checkout", authenticateToken, createWhopCheckout);

export default router;
