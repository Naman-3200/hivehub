// routes/storeRoutes.js
import express from "express";
import { createStore, getSlugStore, getStores, editStore, updateWebsite, getStoreWebsiteHTML, getStoreById, storeProduct, listPublishedProductsForStore, getStorePublishedProducts } from "../controller/store.controller.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.middleware.js";
import { toggleStoreStatus } from "../controller/store.controller.js";


const router = express.Router();

router.post("/", authenticateToken, createStore);
router.get("/", authenticateToken, getStores);
router.get("/slug/:slug", getSlugStore); 
router.put("/:storeId/domain", authenticateToken, editStore);
router.put("/stores/:storeId/website", updateWebsite);
router.get("/:storeId/html", getStoreWebsiteHTML)
router.get("/:storeId", getStoreById);
router.get("/:storeId/published-products", storeProduct)
router.get("/:storeId/published-products", getStorePublishedProducts);

router.put(
  "/:storeId/toggle-status",
  authenticateToken,
  authorizeRole("superadmin"),
  toggleStoreStatus
);
router.get("/stores/:storeId/published-products", listPublishedProductsForStore);





export default router;
