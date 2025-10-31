// routes/admin.routes.js
import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  getAdminOverview,
  listSubscriptions,
  listUsers,
  toggleUserDisabled,
  listStores,
  toggleStoreDisabled
} from "../controller/admin.controller.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log("🛠 ADMIN ROUTE HIT:", req.method, req.originalUrl);
  next();
});


router.get("/overview", authenticateToken, requireRole("superadmin"), getAdminOverview);
router.get("/subscriptions", authenticateToken, requireRole("superadmin"), listSubscriptions);

router.get("/users", authenticateToken, requireRole("superadmin"), listUsers);
router.patch("/users/:userId/disable", authenticateToken, requireRole("superadmin"), toggleUserDisabled);

router.get("/stores", authenticateToken, requireRole("superadmin"), listStores);
router.patch("/stores/:storeId/disable", authenticateToken, requireRole("superadmin"), toggleStoreDisabled);

export default router;
