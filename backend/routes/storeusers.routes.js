// routes/storeUsers.routes.js
import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { requireStoreOwner } from "../middleware/ownership.middleware.js";
import {
  listStoreUsers,
  getStoreUserProfile,
  blockStoreUser,
  deleteStoreUser
} from "../controller/storeusers.controller.js";

const router = express.Router();

router.get("/", authenticateToken, requireStoreOwner, listStoreUsers);
router.get("/:storeUserId", authenticateToken, getStoreUserProfile); // owner or superadmin enforced inside
router.patch("/:storeUserId/block", authenticateToken, blockStoreUser);
router.delete("/:storeUserId", authenticateToken, deleteStoreUser);

export default router;
