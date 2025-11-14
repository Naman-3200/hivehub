import React from "react";
import { markAllAsRead } from "../utils/notificationService";

const NotificationsPage = ({
  user,
  notifications,
  setNotifications,
  loadingNotifications,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🔔 Notifications</h1>

        <button
          onClick={() => {
            if (!user?._id) return;
            markAllAsRead(user._id);
            setNotifications(prev =>
              prev.map(n => ({ ...n, isRead: true }))
            );
          }}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Mark all as read
        </button>
      </div>

      {/* Loading */}
      {loadingNotifications ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications yet 📭</p>
      ) : (
        <div className="space-y-4">
          {notifications.map(n => (
            <div
              key={n._id}
              className={`bg-white p-4 rounded-xl shadow transition-all ${
                n.isRead
                  ? "opacity-80"
                  : "border-l-4 border-indigo-500 shadow-md"
              }`}
            >
              <p className="font-medium text-gray-900 flex items-center gap-2">
                {n.icon || "🔔"} {n.message}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
