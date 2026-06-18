import mongoose from "mongoose";

const GenProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: [{ type: String, required: true }], // AI can generate link (via DALL·E) or placeholder
    ratings: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    originalPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    potentialProfit: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("GenProduct", GenProductSchema);
