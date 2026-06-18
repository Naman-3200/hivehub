// checkWebProducts.js
import mongoose from "mongoose";
import WebProduct from "./model/webproduct.model.js"; 

// Replace with your MongoDB URI
const MONGO_URI = "mongodb+srv://souravbhowal:hivehub2025@hive-hub-cluster.injrohh.mongodb.net/hive-hub";

async function checkAllProducts() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const products = await WebProduct.find({});
    console.log("📦 All WebProducts:");
    console.log(JSON.stringify(products, null, 2));

    console.log(`\nTotal products: ${products.length}`);
  } catch (err) {
    console.error("❌ Error fetching WebProducts:", err);
  } finally {
    mongoose.connection.close();
  }
}

checkAllProducts();
