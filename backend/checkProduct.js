// scripts/checkProduct.js
import mongoose from "mongoose";
import WebProduct from "./model/webproduct.model.js";
import StoreProduct from "./model/product.model.js"

const MONGO_URI = "mongodb+srv://souravbhowal:hivehub2025@hive-hub-cluster.injrohh.mongodb.net/hive-hub";

const run = async () => {
  await mongoose.connect(MONGO_URI);

  const product = await WebProduct.findOne({ productId: "2509290553291611300" });
  console.log(product);

  await mongoose.disconnect();
};

run().catch(console.error);
