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
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // ⭐ CHANGE: Make password optional for Google users
    myProducts: [myProductSchema],
    isVerified: { type: Boolean, default: false }, // ⭐ ADD: Add isVerified field
  },
  { timestamps: true }
);

// ⭐ CHANGE: Use default export instead of named export
const User = mongoose.model("User", userSchema);
export default User;
