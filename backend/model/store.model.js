import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true }, 
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;
