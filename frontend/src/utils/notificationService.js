const API_URL = "https://hivehub-1.onrender.com/api/notifications";

export const getNotifications = async (userId) => {
  const res = await fetch(`${API_URL}/${userId}`);
  return res.json();
};

export const markAsRead = async (id) => {
  const res = await fetch(`${API_URL}/read/${id}`, { method: "PUT" });
  return res.json();
};

export const markAllAsRead = async (userId) => {
  const res = await fetch(`${API_URL}/read-all/${userId}`, { method: "PUT" });
  return res.json();
};
