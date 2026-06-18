// backend/routes/webProductRoutes.js
import express from "express";
import { getWebProductsByStore } from "../controller/webproduct.controller.js";

const router = express.Router();

router.get("/:storeId", getWebProductsByStore);

export default router;
