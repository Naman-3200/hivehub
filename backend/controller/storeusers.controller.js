// controller/storeUsers.controller.js
import StoreUser from "../model/storeuser.model.js";
import Order from "../model/order.model.js";
import Store from "../model/store.model.js";
import mongoose from "mongoose";

// GET /api/store-users/manage?storeId=...&range=day|week|month|year
export const listStoreUsers = async (req, res) => {
  try {
    const { storeId, range = "month" } = req.query;
    if (!storeId) return res.status(400).json({ message: "storeId required" });

    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // owner or superadmin only
    if (req.user.role !== "superadmin" && String(store.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ranges = {
      day: 1,
      week: 7,
      month: 30,
      year: 365
    };
    const days = ranges[range] || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const users = await StoreUser.find({ storeId }).sort({ createdAt: -1 });

    // joining stats
    const joinAgg = await StoreUser.aggregate([
      { $match: { storeId: new mongoose.Types.ObjectId(storeId), createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } }
    ]);

    const timeseries = joinAgg.map(x => {
      const date = new Date(x._id.y, x._id.m - 1, x._id.d).toISOString().slice(0, 10);
      return { date, joined: x.count };
    });

    return res.json({ users, timeseries, total: users.length });
  } catch (e) {
    console.error("listStoreUsers error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStoreUserProfile = async (req, res) => {
  try {
    const { storeUserId } = req.params;
    const su = await StoreUser.findById(storeUserId);
    if (!su) return res.status(404).json({ message: "Store user not found" });

    // ownership check
    const store = await Store.findById(su.storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });
    if (
      req.user.role !== "superadmin" &&
      String(store.ownerId) !== String(req.user.id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Order.find({ storeId: su.storeId, customerId: su._id }).sort({ createdAt: -1 });

    res.json({
      profile: {
        id: su._id,
        name: su.name,
        email: su.email,
        phone: su.phone,
        address: su.address,
        blocked: su.blocked,
        createdAt: su.createdAt
      },
      orders
    });
  } catch (e) {
    console.error("getStoreUserProfile error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

export const blockStoreUser = async (req, res) => {
  try {
    const { storeUserId } = req.params;
    const { blocked } = req.body;

    const su = await StoreUser.findById(storeUserId);
    if (!su) return res.status(404).json({ message: "Store user not found" });

    // owner or superadmin
    const store = await Store.findById(su.storeId);
    if (req.user.role !== "superadmin" && String(store.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    su.blocked = !!blocked;
    await su.save();
    res.json({ message: su.blocked ? "User blocked" : "User unblocked" });
  } catch (e) {
    console.error("blockStoreUser error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteStoreUser = async (req, res) => {
  try {
    const { storeUserId } = req.params;
    const su = await StoreUser.findById(storeUserId);
    if (!su) return res.status(404).json({ message: "Store user not found" });

    const store = await Store.findById(su.storeId);
    if (req.user.role !== "superadmin" && String(store.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await su.deleteOne();
    res.json({ message: "Store user deleted" });
  } catch (e) {
    console.error("deleteStoreUser error:", e);
    res.status(500).json({ message: "Server error" });
  }
};
