// backend/routes/paymentRoutes.js
import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { createWhopCheckout } from "../controller/payment.controller.js";
const router = express.Router();

router.post("/whop/checkout",  createWhopCheckout);

export default router;
