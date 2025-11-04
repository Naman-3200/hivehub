// models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // admin/owner user (who owns store)
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },

    // NEW: consumer (store visitor) – optional, used for store-side user management
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "StoreUser" },

    items: [
      {
        productId: { type: String },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalPrice: { type: Number, default: 0 }, // <-- used for revenue everywhere

    // payment + status
    status: { type: String, enum: ["pending", "paid", "failed", "refunded", "completed"], default: "pending" },
    currency: { type: String, default: "USD" },
    paymentProvider: { type: String, default: "whop" },
    paymentSessionId: String, // if needed for whop
    paymentUrl: String,

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
