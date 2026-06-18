// backend/routes/inventory.routes.js
import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.middleware.js";
import { uploadMedia } from "../middleware/upload.js";
import {
  createInventory,
  getInventoryItem,
  updateInventory,
  assignStores,
  listInventory,
} from "../controller/inventory.controller.js";
import multer from "multer";


const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });


router.post(
  "/",
  authenticateToken,
  authorizeRole("admin", "superadmin","user"),
  upload.array("media", 20),
  createInventory
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "superadmin","user"),
  getInventoryItem
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "superadmin","user"),
  uploadMedia,
  updateInventory
);

router.patch(
  "/:id/stores",
  authenticateToken,
  authorizeRole("admin", "superadmin","user"),
  assignStores
);

router.get("/", authenticateToken, authorizeRole("admin","superadmin","user"), listInventory);


export default router;
