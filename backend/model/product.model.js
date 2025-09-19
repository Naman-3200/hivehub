import mongoose from "mongoose";

const StoreProductSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cjProductId: { type: String, required: true },
    name: String,
    image: String,
    price: String,
  },
  { timestamps: true }
);

export default mongoose.model("StoreProduct", StoreProductSchema);
