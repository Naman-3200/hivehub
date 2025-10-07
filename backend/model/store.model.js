import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true }, 
  customDomain: { type: String, unique: true, sparse: true }, // optional user domain
  domainVerified: Boolean,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
      // ✅ New field to store website HTML
    websiteHtml: { type: String, default: "" },
    websiteCss: { type: String },


    // (Optional) store data of last published products
    publishedProducts: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;
