// models/user.model.js
import mongoose from "mongoose";

const myProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true }, // CJ pid
    name: String,
    price: Number,
    image: String,
    category: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    myProducts: [myProductSchema], // ⭐ NEW FIELD
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
