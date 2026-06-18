// controller/admin.controller.js
import User from "../model/user.model.js";
import Store from "../model/store.model.js";
import Order from "../model/order.model.js";
import mongoose from "mongoose";

// KPIs: total users, total stores, subscriptions breakdown, revenue
export const getAdminOverview = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRevenueAgg, subs] = await Promise.all([
      User.countDocuments({}),
      Store.countDocuments({}),
      Order.aggregate([{ $match: { status: { $in: ["paid", "completed"] } } }, { $group: { _id: null, sum: { $sum: "$totalPrice" } } }]),
      User.aggregate([
        { $group: { _id: "$subscription.status", count: { $sum: 1 } } },
      ])
    ]);

    const totalRevenue = totalRevenueAgg[0]?.sum || 0;

    const subMap = subs.reduce((acc, s) => (acc[s._id || "none"] = s.count, acc), {});
    const result = {
      totalUsers,
      totalStores,
      totalRevenueHiveeHub: totalRevenue,
      subscriptions: {
        active: subMap["active"] || 0,
        expired: subMap["expired"] || 0,
        canceled: subMap["canceled"] || 0,
        trial: subMap["trial"] || 0,
        none: subMap["none"] || 0,
      }
    };

    res.json(result);
  } catch (e) {
    console.error("getAdminOverview error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

export const listSubscriptions = async (req, res) => {
  try {
    const users = await User.find(
      { "subscription.status": { $ne: "none" } },
      { name: 1, email: 1, subscription: 1, createdAt: 1 }
    ).sort({ "subscription.expiresAt": 1 });

    res.json(users);
  } catch (e) {
    console.error("listSubscriptions error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

export const listUsers = async (req, res) => {
  try {
    const q = await User.find({}, { name: 1, email: 1, role: 1, disabled: 1, createdAt: 1, subscription: 1 }).sort({ createdAt: -1 });
    res.json(q);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleUserDisabled = async (req, res) => {
  try {
    const { userId } = req.params;
    const { disabled } = req.body;
    const u = await User.findByIdAndUpdate(userId, { disabled: !!disabled }, { new: true });
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json({ message: u.disabled ? "User disabled" : "User enabled" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const listStores = async (req, res) => {
  try {
    const stores = await Store.find({}, { name: 1, ownerId: 1, totalRevenue: 1, totalOrders: 1, createdAt: 1, customDomain: 1, domain: 1, domainVerified: 1, disabled: 1, });
    res.json(stores);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleStoreDisabled = async (req, res) => {
  try {
    console.log("✅ toggleStoreDisabled hit");
    console.log("➡️ Params:", req.params);
    console.log("➡️ Body:", req.body);

    const { storeId } = req.params;
    const { disabled } = req.body;
    const st = await Store.findByIdAndUpdate(storeId, { disabled }, { new: true });
    if (!st) return res.status(404).json({ message: "Store not found" });
    res.json({ message: st.disabled ? "Store disabled" : "Store enabled" });
  } catch (e) {
    console.error("Error in toggleStoreDisabled:", e);
    res.status(500).json({ message: "Server error" });
  }
};

