import mongoose from "mongoose";
import {myProductSchema} from "./user.model.js";


const StoreProductSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: { type: String, required: true },
    name: String,
    image: String,
    price: String,
    category: String,
    sellingPrice: String,
    quantity: Number,
    storeId: { type: String },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  myProducts: [myProductSchema],  // 👈 embedded subdocument
});

export default mongoose.model("StoreProduct", StoreProductSchema);
