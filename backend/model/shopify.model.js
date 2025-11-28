import mongoose from "mongoose";

const ShopifyStoreSchema = new mongoose.Schema({
  hiveStoreId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  shop: { type: String, required: true },         
  accessToken: { type: String, required: true },
  ownerId: { type: String, required: true },      
  installedAt: { type: Date, default: Date.now },
});

ShopifyStoreSchema.index({ shop: 1 }, { unique: true });

export default mongoose.model("ShopifyStore", ShopifyStoreSchema);
