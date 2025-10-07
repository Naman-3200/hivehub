// routes/storeRoutes.js
import express from "express";
import { createStore, getSlugStore, getStores, editStore, updateWebsite, getStoreWebsiteHTML, getStoreById } from "../controller/store.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, createStore);
router.get("/", authenticateToken, getStores);
router.get("/slug/:slug", getSlugStore); 
router.put("/:storeId/domain", authenticateToken, editStore);
router.put("/stores/:storeId/website", updateWebsite);
router.get("/stores/:storeId/html", getStoreWebsiteHTML)
router.get("/:storeId", getStoreById);


export default router;
