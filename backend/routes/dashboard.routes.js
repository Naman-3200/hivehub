// routes/dashboard.routes.js
import express from "express";
import { getDashboardKPIs, getKPIs } from "../controller/dashboard.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js"; // or your existing auth middleware

const router = express.Router();

// router.get("/kpis", authenticateToken, getKPIs);
router.get("/kpis", authenticateToken, getDashboardKPIs);


export default router;
