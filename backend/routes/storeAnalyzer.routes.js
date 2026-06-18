import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {
  analyzeStore,
  importProductToMyStore,
  // shopifyInstall
} from "../controller/storeAnalyzer.controller.js";

const router = express.Router();

router.post("/analyze", authenticateToken, analyzeStore);
// router.get("/install", authenticateToken, shopifyInstall);
router.post("/import-product", authenticateToken, importProductToMyStore);

export default router;
