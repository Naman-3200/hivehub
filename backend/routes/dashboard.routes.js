// routes/dashboard.routes.js
import express from "express";
import { getKPIs } from "../controller/dashboard.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js"; // or your existing auth middleware

const router = express.Router();

router.get("/kpis", authenticateToken, getKPIs);

export default router;
