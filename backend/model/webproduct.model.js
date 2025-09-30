// models/MyProduct.js
import mongoose from "mongoose";

const myProductSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: String, required: true }, 
    name: String,
    price: Number,
    image: String,
    category: String,
    storeId: String, 
    sellingPrice: String,
    quantity: Number,
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("WebProduct", myProductSchema);
