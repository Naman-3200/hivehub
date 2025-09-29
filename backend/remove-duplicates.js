import mongoose from "mongoose";
import StoreProduct from "./model/product.model.js"; // adjust path

// connect to MongoDB
const MONGO_URI = "mongodb+srv://souravbhowal:hivehub2025@hive-hub-cluster.injrohh.mongodb.net/hive-hub"; // change your db name
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function removeDuplicates() {
  try {
    console.log("🔍 Checking for duplicate products...");

    // Group by userId + productId + storeId and collect duplicates
    const duplicates = await StoreProduct.aggregate([
      {
        $group: {
          _id: { userId: "$userId", productId: "$productId", storeId: "$storeId" },
          ids: { $push: "$_id" }, // collect all doc ids
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } }, // only keep duplicates
    ]);

    console.log(`Found ${duplicates.length} duplicate groups.`);

    for (const dup of duplicates) {
      // sort IDs (oldest first)
      const [keep, ...remove] = dup.ids.sort();

      // delete all but first
      await StoreProduct.deleteMany({ _id: { $in: remove } });

      console.log(`✅ Kept ${keep}, removed ${remove.length} duplicates for`, dup._id);
    }

    console.log("🎉 Duplicate cleanup finished!");
  } catch (err) {
    console.error("❌ Error removing duplicates:", err);
  } finally {
    mongoose.disconnect();
  }
}

removeDuplicates();
