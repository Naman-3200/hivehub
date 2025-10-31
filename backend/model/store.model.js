import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true }, 
  customDomain: { type: String, unique: true, sparse: true }, 
  domainVerified: Boolean,
  totalRevenue: { type: Number, default: 0 }, 
  totalOrders: { type: Number, default: 0 },  
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  websiteHtml: { type: String, default: "" },
  websiteCss: { type: String },
  publishedProducts: { type: Array, default: [] },
  disabled: { type: Boolean, default: false }, 

    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;
