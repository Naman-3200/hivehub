import express from "express";
const router = express.Router();
import { getNotifications, createNotification, markAsRead, markAllAsRead } from "../controller/notifications.controller.js";

// ✅ All routes prefixed with /api/notifications
router.get("/:userId", getNotifications);
router.post("/", createNotification);
router.put("/read/:id", markAsRead);
router.put("/read-all/:userId", markAllAsRead);

export default router;
