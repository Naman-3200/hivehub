// scripts/seedProduct.js
import mongoose from "mongoose";
import WebProduct from "./model/webproduct.model.js";

const MONGO_URI = "mongodb+srv://souravbhowal:hivehub2025@hive-hub-cluster.injrohh.mongodb.net/hive-hub";

const run = async () => {
  await mongoose.connect(MONGO_URI);

  const product = await WebProduct.create({
    userId: new mongoose.Types.ObjectId(), // fake user for testing
    productId: "2509241035171603300",
    name: "Test Chandelier",
    price: 72.47,
    image: "https://example.com/test.jpg",
    category: "Chandeliers",
    storeId: "651a9e2b8f3d2c4f1a23b7c8",
  });

  console.log("Inserted:", product);

  await mongoose.disconnect();
};

run().catch(console.error);
