// backend/utils/makeSuperAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/user.model.js";

const MONGO_URI = "mongodb+srv://souravbhowal:hivehub2025@hive-hub-cluster.injrohh.mongodb.net/hive-hub";

// === EDIT THIS EMAIL TO YOUR GOOGLE EMAIL ===
const EMAIL_TO_PROMOTE = "namanp2300@gmail.com";

const makeSuperAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.findOne({ email: EMAIL_TO_PROMOTE });

    if (!user) {
      console.log(`❌ No user found with email: ${EMAIL_TO_PROMOTE}`);
      process.exit(1);
    }

    user.role = "superadmin";
    await user.save();

    console.log(`✅ Success! ${EMAIL_TO_PROMOTE} is now a SUPERADMIN.`);
    console.log("User document:", {
      name: user.name,
      email: user.email,
      role: user.role,
    });

    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error promoting user:", err);
    process.exit(1);
  }
};

makeSuperAdmin();
