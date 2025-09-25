import mongoose from "mongoose";

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

        storeId: { type: String, required: true },

  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  myProducts: [myProductSchema],  // 👈 embedded subdocument
});

export default mongoose.model("StoreProduct", StoreProductSchema);
