// backend/model/inventory.model.js
import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String }, // optional
    description: { type: String, default: "" },

    // ✅ multiple media
    images: [{ type: String, default: [] }],
    videos: [{ type: String, default: [] }],

    // pricing
    costPrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },

    category: { type: String, default: "" },

    // ✅ one product → many stores
    stores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Store" }],

    // ownership
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // status/stock
    stock: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("InventoryItem", inventorySchema);
