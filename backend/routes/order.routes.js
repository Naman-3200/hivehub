import express from "express";
import { createOrder, getOrders } from "../controller/order.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { markPaid } from "../controller/order.controller.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/", getOrders);
router.post("/mark-paid", authenticateToken, markPaid);


export default router;
