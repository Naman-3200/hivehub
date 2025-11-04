import Order from "../model/order.model.js";
import Store from "../model/store.model.js";
import Product from "../model/product.model.js";
import { v4 as uuidv4 } from 'uuid'; 
import { createNotification } from "../utils/notificationService.js";



// export const createOrder = async (req, res) => {
//   try {
//     const orderId = uuidv4();
//     const { storeId, userId, items, total } = req.body;

//     if (!storeId || !userId || !items || !items.length) {
//       return res.status(400).json({ message: "Invalid order data" });
//     }

//     const newOrder = await Order.create({
//       orderId,
//       storeId,
//       userId: req.body.userId,
//       items: req.body.items,
//       totalPrice: req.body.totalPrice,
//       status: req.body.status || 'pending'
//     });

//     return res.status(201).json({
//       message: "Order created successfully",
//       order: newOrder,
//     });
//   } catch (error) {
//     console.error("Create order error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Optional: fetch orders for admin or user
// export const getOrders = async (req, res) => {
//   try {
//     const { userId, storeId } = req.query;
//     const where = {};
//     if (userId) where.userId = userId;
//     if (storeId) where.storeId = storeId;

//     const orders = await Order.findAll({ where, order: [["createdAt", "DESC"]] });
//     res.json(orders);
//   } catch (error) {
//     console.error("Get orders error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };







// export const createOrder = async (req, res) => {
//   try {
//     const orderId = uuidv4();
//     const { storeId, userId, items, status } = req.body;

//     if (!storeId || !userId || !items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Invalid order data" });
//     }

//     // Normalize items (ensure quantity)
//     const normalizedItems = items.map(i => ({
//       productId: i.productId || null,
//       name: i.name || (i.productId ? undefined : i.name),
//       price: Number(i.price || 0),
//       quantity: Number(i.quantity || 1),
//     }));

//     // Compute total amount
//     let totalAmount = 0;
//     for (const item of items) {
//       if (item.price && item.quantity) {
//         totalAmount += item.price * item.quantity;
//       } else if (item.productId) {
//         const product = await Product.findById(item.productId);
//         if (!product)
//           return res.status(400).json({ message: `Invalid product ID: ${item.productId}` });
//         totalAmount += product.price * (item.quantity || 1);
//       } else {
//         return res.status(400).json({ message: "Invalid item format" });
//       }
//     }

//     const newOrder = await Order.create({
//       orderId,
//       storeId,
//       userId,
//       items,
//       totalAmount, // ✅ required for dashboard KPIs
//       status: status || "pending",
//     });


//     // ✅ Update store stats
//     const store = await Store.findById(storeId);
//     if (store) {
//       store.totalRevenue += totalAmount;
//       store.totalOrders += 1;
//       await store.save();
//     }

//     // Notify the store owner
//     await createNotification({
//       userId,
//       type: 'order',
//       message: `📦 Order #${newOrder._id} has been received!`,
//       icon: '📦',
//       meta: { orderId: newOrder._id, storeId }
//     });

//     return res.status(201).json({
//       message: "Order created successfully",
//       order: newOrder,
//     });
//   } catch (error) {
//     console.error("Create order error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };




export const createOrder = async (req, res) => {
  try {
    const orderId = uuidv4();
    const { storeId, userId, items, status } = req.body;

    // 🛑 Validate incoming data
    if (!storeId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // ✅ Normalize items & sanitize NaN values
    const normalizedItems = items.map((item, idx) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity || 1);

      if (isNaN(price) || price < 0) {
        console.warn(`⚠️ Invalid price for item index ${idx}:`, item);
      }

      return {
        productId: item.productId || null,
        name: item.name || "Unnamed Product",
        price: !isNaN(price) && price > 0 ? price : 0,
        quantity: !isNaN(quantity) && quantity > 0 ? quantity : 1,
      };
    });

    // ✅ Compute total safely
    const totalAmount = normalizedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // ✅ Handle userId optional — guests allowed
    const orderData = {
      orderId,
      storeId,
      userId: userId && userId !== "null" ? userId : undefined, // only set if defined
      items: normalizedItems,
      totalAmount,
      status: status || "pending",
    };

    // ✅ Save order
    const newOrder = await Order.create(orderData);

    // ✅ Update store stats (if exist)
    const store = await Store.findById(storeId);
    if (store) {
      store.totalRevenue = (store.totalRevenue || 0) + totalAmount;
      store.totalOrders = (store.totalOrders || 0) + 1;
      await store.save();
    }

    // ✅ Notify store owner
    // await createNotification({
    //   userId: store?.ownerId || null,
    //   type: "order",
    //   message: `📦 New order #${newOrder._id} received.`,
    //   icon: "📦",
    //   meta: { orderId: newOrder._id, storeId },
    // });

    return res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Create order error:", error);
    return res.status(500).json({
      message: "Server error while creating order",
      error: error.message,
    });
  }
};


// Optional: fetch orders for admin or user
export const getOrders = async (req, res) => {
  try {
    const { userId, storeId } = req.query;
    const where = {};
    if (userId) where.userId = userId;
    if (storeId) where.storeId = storeId;

    const orders = await Order.find(where).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const markPaid = async (req, res) => {
  try {
    const { orderId } = req.body; // send from frontend after success
    if (!orderId) return res.status(400).json({ message: "orderId required" });

    const order = await Order.findOneAndUpdate({ orderId }, { status: "paid" }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order marked paid", order });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
