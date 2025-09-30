// models/user.model.js
import mongoose from "mongoose";

export const myProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true }, // CJ pid
    name: String,
    price: Number,
    image: String,
    category: String,
    sellingPrice: String,  
    quantity: Number,      
    storeId: { type: String, required: true },
    published: { type: Boolean, default: false }
  },
  { _id: false ,timestamps: true }
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
    password: { type: String, required: false },

    myProducts: [myProductSchema],

    isVerified: { type: Boolean, default: false },

    // OTP FIELDS
    otp: { type: String },
    otpExpires: { type: Date },
    otpAttempts: { type: Number, default: 0 },
    lastOtpSent: { type: Date },

    // RESET PASSWORD FIELDS
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
