import { Router } from "express";
import { body } from "express-validator";
import {
  deleteUser,
  getAllUsers,
  getMe,
  getUserStats,
  login,
  register,
  updateUserRole,
} from "../controller/user.controller.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

// Protected routes
router.get("/me", authenticateToken, getMe);

// SuperAdmin only routes
router.get("/", authenticateToken, authorizeRole("superadmin"), getAllUsers);

router.get(
  "/stats",
  authenticateToken,
  authorizeRole("superadmin"),
  getUserStats
);

router.put(
  "/:userId/role",
  authenticateToken,
  authorizeRole("superadmin"),
  [
    body("role")
      .isIn(["user", "admin", "superadmin"])
      .withMessage("Role must be user, admin, or superadmin"),
  ],
  updateUserRole
);
router.delete("/:userId", authenticateToken, deleteUser);

export default router;
