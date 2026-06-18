import Notification from "../model/notifications.model.js";

// ✅ Proper async function definition
export const createNotification = async ({ ownerId, type, message, icon, meta }) => {
  try {
    const notif = await Notification.create({
      userId: ownerId || userId,
      type,
      message,
      icon,
      meta,
    });
    return notif;
  } catch (err) {
    console.error("Notification create error:", err);
    throw new Error("Failed to create notification");
  }
};