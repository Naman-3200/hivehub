import mongoose from "mongoose";
import dotenv from "dotenv";
import Store from "./model/store.model.js"; // adjust path if needed

dotenv.config(); // make sure you have .env with MONGO_URI

const MONGO_URI = "mongodb+srv://souravbhowal:hivehub2025@hive-hub-cluster.injrohh.mongodb.net/hive-hub";

const run = async () => {
  try {
    // connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // create a dummy store
    const store = new Store({
      name: "Test Store",
      domain: "teststore.com",
      ownerId: new mongoose.Types.ObjectId(), // fake owner ID
    });

    const savedStore = await store.save();
    console.log("✅ Store saved successfully:", savedStore);

    // fetch all stores
    const stores = await Store.find();
    console.log("📦 All stores in DB:", stores);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

run();
