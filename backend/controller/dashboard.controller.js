// // controllers/dashboard.controller.js
// import Order from "../model/order.model.js";
// import User from "../model/user.model.js";
// import Store from "../model/store.model.js"; // adjust path if needed
// import mongoose from "mongoose";

// /**
//  * GET /api/dashboard/kpis?start=ISO&end=ISO&storeId=...
//  * Protected route
//  */
// export const getKPIs = async (req, res) => {
//   try {
//     // parse query params
//     const { start, end, storeId } = req.query;

//     // fallback: last 7 days
//     const endDate = end ? new Date(end) : new Date();
//     const startDate = start ? new Date(start) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

//     // ensure valid dates
//     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//       return res.status(400).json({ message: "Invalid start or end date" });
//     }

//     // build match filter for orders
//     const match = {
//       createdAt: { $gte: startDate, $lte: endDate },
//     };
//     if (storeId) match.storeId = mongoose.Types.ObjectId(storeId);

//     // 1) Total orders & total revenue & avg order value
//     const ordersAgg = await Order.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: null,
//           totalOrders: { $sum: 1 },
//           totalRevenue: { $sum: "$totalPrice" },
//           avgOrderValue: { $avg: "$totalPrice" },
//         },
//       },
//     ]);

//     const orderMetrics = ordersAgg[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 };

//     // 2) New customers = users created in period (optionally limited to store customers if you have store-specific customer relation)
//     // We'll count users whose createdAt falls in the range.
//     const newCustomers = await User.countDocuments({
//       createdAt: { $gte: startDate, $lte: endDate },
//     });

//     // 3) Repeat purchases: count distinct users with >1 order in the period
//     const repeatAgg = await Order.aggregate([
//       { $match: match },
//       { $group: { _id: "$userId", ordersCount: { $sum: 1 } } },
//       { $match: { ordersCount: { $gt: 1 } } },
//       { $count: "repeatCustomers" },
//     ]);
//     const repeatCustomers = (repeatAgg[0] && repeatAgg[0].repeatCustomers) || 0;

//     // 4) Orders timeseries (daily) for chart
//     const timeseries = await Order.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//             day: { $dayOfMonth: "$createdAt" },
//           },
//           revenue: { $sum: "$totalPrice" },
//           orders: { $sum: 1 },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
//     ]);

//     const timeseriesFormatted = timeseries.map((t) => {
//       const { _id, revenue, orders } = t;
//       const date = new Date(_id.year, _id.month - 1, _id.day);
//       return { date: date.toISOString().slice(0, 10), revenue, orders };
//     });

//     // 5) Total stores & top stores by revenue in period
//     const totalStores = await Store.countDocuments({});
//     const topStoresAgg = await Order.aggregate([
//       { $match: match },
//       { $group: { _id: "$storeId", revenue: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
//       { $sort: { revenue: -1 } },
//       { $limit: 10 },
//       {
//         $lookup: {
//           from: "stores",
//           localField: "_id",
//           foreignField: "_id",
//           as: "store",
//         },
//       },
//       {
//         $unwind: {
//           path: "$store",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $project: {
//           storeId: "$_id",
//           revenue: 1,
//           orders: 1,
//           name: "$store.name",
//         },
//       },
//     ]);

//     return res.json({
//       metrics: {
//         totalRevenue: orderMetrics.totalRevenue || 0,
//         totalOrders: orderMetrics.totalOrders || 0,
//         avgOrderValue: orderMetrics.avgOrderValue || 0,
//         newCustomers,
//         repeatCustomers,
//       },
//       timeseries: timeseriesFormatted,
//       topStores: topStoresAgg,
//       totalStores,
//     });
//   } catch (err) {
//     console.error("Dashboard KPI error:", err);
//     return res.status(500).json({ message: "Server error computing KPIs", error: err.message });
//   }
// };







// controllers/dashboard.controller.js
import Order from "../model/order.model.js";
import User from "../model/user.model.js";
import Store from "../model/store.model.js";
import mongoose from "mongoose";

// export const getKPIs = async (req, res) => {
//   try {
//     const { start, end, storeId } = req.query;

//     // Date range
//     const endDate = end ? new Date(end) : new Date();
//     const startDate = start
//       ? new Date(start)
//       : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

//     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//       return res.status(400).json({ message: "Invalid start or end date" });
//     }

//     // --- Build filter ---
//     const match = { createdAt: { $gte: startDate, $lte: endDate } };
//     if (storeId && mongoose.Types.ObjectId.isValid(storeId)) {
//       match.storeId = new mongoose.Types.ObjectId(storeId);
//     }

//     // --- Orders aggregate ---
//     const ordersAgg = await Order.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: null,
//           totalOrders: { $sum: 1 },
//           totalRevenue: { $sum: "$totalPrice" },
//           avgOrderValue: { $avg: "$totalPrice" },
//         },
//       },
//     ]);

//     const orderMetrics = ordersAgg[0] || {
//       totalOrders: 0,
//       totalRevenue: 0,
//       avgOrderValue: 0,
//     };

//     // --- New customers ---
//     const newCustomers = await User.countDocuments({
//       createdAt: { $gte: startDate, $lte: endDate },
//     });

//     // --- Repeat customers ---
//     const repeatAgg = await Order.aggregate([
//       { $match: match },
//       { $group: { _id: "$userId", ordersCount: { $sum: 1 } } },
//       { $match: { ordersCount: { $gt: 1 } } },
//       { $count: "repeatCustomers" },
//     ]);
//     const repeatCustomers =
//       (repeatAgg[0] && repeatAgg[0].repeatCustomers) || 0;

//     // --- Daily timeseries ---
//     const timeseries = await Order.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//             day: { $dayOfMonth: "$createdAt" },
//           },
//           revenue: { $sum: "$totalPrice" },
//           orders: { $sum: 1 },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
//     ]);

//     const timeseriesFormatted = timeseries.map((t) => {
//       const { _id, revenue, orders } = t;
//       const date = new Date(_id.year, _id.month - 1, _id.day);
//       return { date: date.toISOString().slice(0, 10), revenue, orders };
//     });

//     // --- Total stores + top stores ---
//     const totalStores = await Store.countDocuments();
//     const topStoresAgg = await Order.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: "$storeId",
//           revenue: { $sum: "$totalPrice" },
//           orders: { $sum: 1 },
//         },
//       },
//       { $sort: { revenue: -1 } },
//       { $limit: 10 },
//       {
//         $lookup: {
//           from: "stores",
//           localField: "_id",
//           foreignField: "_id",
//           as: "store",
//         },
//       },
//       { $unwind: { path: "$store", preserveNullAndEmptyArrays: true } },
//       {
//         $project: {
//           storeId: "$_id",
//           revenue: 1,
//           orders: 1,
//           name: "$store.name",
//         },
//       },
//     ]);

//     return res.json({
//       metrics: {
//         totalRevenue: orderMetrics.totalRevenue || 0,
//         totalOrders: orderMetrics.totalOrders || 0,
//         avgOrderValue: orderMetrics.avgOrderValue || 0,
//         newCustomers,
//         repeatCustomers,
//       },
//       timeseries: timeseriesFormatted,
//       topStores: topStoresAgg,
//       totalStores,
//     });
//   } catch (err) {
//     console.error("Dashboard KPI error:", err);
//     return res
//       .status(500)
//       .json({ message: "Server error computing KPIs", error: err.message });
//   }
// };



// export const getKPIs = async (req, res) => {
//   try {
//     const { start, end, storeId } = req.query;
//     const match = {};

//     if (storeId) match.storeId = new mongoose.Types.ObjectId(storeId);
//     if (start || end) {
//       match.createdAt = {};
//       if (start) match.createdAt.$gte = new Date(start);
//       if (end) match.createdAt.$lte = new Date(end);
//     }

//     // Fetch all matching orders
//     const orders = await Order.find(match);

//     // Basic metrics
//     const totalOrders = orders.length;
//     const totalRevenue = orders.reduce(
//       (sum, o) => sum + (o.totalAmount || 0),
//       0
//     );
//     const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

//     // Customer metrics
//     const customerOrders = {};
//     orders.forEach((o) => {
//       const uid = o.userId?.toString();
//       if (uid) customerOrders[uid] = (customerOrders[uid] || 0) + 1;
//     });

//     const newCustomers = Object.values(customerOrders).filter(
//       (count) => count === 1
//     ).length;
//     const repeatCustomers = Object.values(customerOrders).filter(
//       (count) => count > 1
//     ).length;

//     // Time series (daily)
//     const dailyData = {};
//     orders.forEach((o) => {
//       const date = new Date(o.createdAt).toISOString().split("T")[0];
//       if (!dailyData[date]) dailyData[date] = { date, orders: 0, revenue: 0 };
//       dailyData[date].orders++;
//       dailyData[date].revenue += o.totalAmount || 0;
//     });

//     const timeseries = Object.values(dailyData).sort((a, b) =>
//       a.date.localeCompare(b.date)
//     );

//     // Top stores
//     const topStoresAgg = await Order.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: "$storeId",
//           revenue: { $sum: "$totalAmount" },
//           orders: { $sum: 1 },
//         },
//       },
//       {
//         $lookup: {
//           from: "stores",
//           localField: "_id",
//           foreignField: "_id",
//           as: "store",
//         },
//       },
//       { $unwind: { path: "$store", preserveNullAndEmptyArrays: true } },
//       {
//         $project: {
//           storeId: "$_id",
//           name: "$store.name",
//           revenue: 1,
//           orders: 1,
//           _id: 0,
//         },
//       },
//       { $sort: { revenue: -1 } },
//       { $limit: 10 },
//     ]);

//     res.json({
//       metrics: {
//         totalOrders,
//         totalRevenue,
//         avgOrderValue,
//         newCustomers,
//         repeatCustomers,
//       },
//       timeseries,
//       topStores: topStoresAgg,
//     });
//   } catch (error) {
//     console.error("Error fetching KPIs:", error);
//     res.status(500).json({ error: "Failed to fetch KPIs" });
//   }
// };






// export const getKPIs = async (req, res) => {
//   try {
//     const { start, end, storeId } = req.query;
//     const match = {};

//     if (storeId) match.storeId = new mongoose.Types.ObjectId(storeId);
//     if (start || end) {
//       match.createdAt = {};
//       if (start) match.createdAt.$gte = new Date(start);
//       if (end) match.createdAt.$lte = new Date(end);
//     }

//     // Fetch all matching orders
//     const orders = await Order.find(match);

//     // Basic metrics
//     const totalOrders = orders.length;
//     const totalRevenue = orders.reduce(
//       (sum, o) => sum + (o.totalAmount || o.totalPrice || 0),
//       0
//     );
//     const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

//     // Customer metrics
//     const customerOrders = {};
//     orders.forEach((o) => {
//       const uid = o.userId?.toString();
//       if (uid) customerOrders[uid] = (customerOrders[uid] || 0) + 1;
//     });

//     const newCustomers = Object.values(customerOrders).filter(
//       (count) => count === 1
//     ).length;
//     const repeatCustomers = Object.values(customerOrders).filter(
//       (count) => count > 1
//     ).length;

//     // Time series (daily)
//     const dailyData = {};
//     orders.forEach((o) => {
//       const date = new Date(o.createdAt).toISOString().split("T")[0];
//       if (!dailyData[date]) dailyData[date] = { date, orders: 0, revenue: 0 };
//       dailyData[date].orders++;
//       dailyData[date].revenue += o.totalAmount || o.totalPrice || 0;
//     });

//     const timeseries = Object.values(dailyData).sort((a, b) =>
//       a.date.localeCompare(b.date)
//     );

//     // Top stores
//     const topStoresAgg = await Order.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: "$storeId",
//           revenue: {
//             $sum: { $ifNull: ["$totalAmount", "$totalPrice"] },
//           },
//           orders: { $sum: 1 },
//         },
//       },
//       {
//         $lookup: {
//           from: "stores",
//           localField: "_id",
//           foreignField: "_id",
//           as: "store",
//         },
//       },
//       { $unwind: { path: "$store", preserveNullAndEmptyArrays: true } },
//       {
//         $project: {
//           storeId: "$_id",
//           name: "$store.name",
//           revenue: 1,
//           orders: 1,
//           _id: 0,
//         },
//       },
//       { $sort: { revenue: -1 } },
//       { $limit: 10 },
//     ]);

//     res.json({
//       metrics: {
//         totalOrders,
//         totalRevenue,
//         avgOrderValue,
//         newCustomers,
//         repeatCustomers,
//       },
//       timeseries,
//       topStores: topStoresAgg,
//     });
//   } catch (error) {
//     console.error("Error fetching KPIs:", error);
//     res.status(500).json({ error: "Failed to fetch KPIs" });
//   }
// };





export const getKPIs = async (req, res) => {
  try {
    const { start, end, storeId } = req.query;

    const match = {};
    if (storeId) match.storeId = new mongoose.Types.ObjectId(storeId);
    if (start || end) {
      match.createdAt = {};
      if (start) match.createdAt.$gte = new Date(start);
      if (end) match.createdAt.$lte = new Date(end);
    }

    // Fetch all matching orders
    const orders = await Order.find(match);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // New vs repeat customers
    const customerCounts = {};
    orders.forEach(o => {
      const id = o.userId?.toString();
      if (id) customerCounts[id] = (customerCounts[id] || 0) + 1;
    });

    const newCustomers = Object.values(customerCounts).filter(v => v === 1).length;
    const repeatCustomers = Object.values(customerCounts).filter(v => v > 1).length;

    // Daily data for chart
    const dailyMap = {};
    orders.forEach(o => {
      const date = new Date(o.createdAt).toISOString().split("T")[0];
      if (!dailyMap[date]) dailyMap[date] = { date, orders: 0, revenue: 0 };
      dailyMap[date].orders++;
      dailyMap[date].revenue += o.totalPrice || 0;
    });
    const timeseries = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

    // Store-wise metrics
    const storeAgg = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$storeId",
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
          avgValue: { $avg: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "stores",
          localField: "_id",
          foreignField: "_id",
          as: "store",
        },
      },
      { $unwind: "$store" },
      {
        $project: {
          storeId: "$_id",
          name: "$store.name",
          totalRevenue: 1,
          totalOrders: 1,
          avgValue: 1,
          _id: 0,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json({
      metrics: { totalOrders, totalRevenue, avgOrderValue, newCustomers, repeatCustomers },
      timeseries,
      storeMetrics: storeAgg,
    });
  } catch (err) {
    console.error("KPI error:", err);
    res.status(500).json({ error: "Failed to fetch KPIs", details: err.message });
  }
};