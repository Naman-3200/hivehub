// routes/storeRoutes.js
import express from "express";
import { createStore, getSlugStore, getStores } from "../controller/store.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, createStore);
router.get("/", authenticateToken, getStores);
router.get("/:slug", getSlugStore); 

export default router;
