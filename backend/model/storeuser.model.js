// models/storeUser.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const storeUserSchema = new mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // NEW: profile + moderation
    phone: String,
    address: String,
    blocked: { type: Boolean, default: false },
    notes: String,
  },
  { timestamps: true }
);

storeUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

storeUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const StoreUser = mongoose.model("StoreUser", storeUserSchema);
export default StoreUser;
