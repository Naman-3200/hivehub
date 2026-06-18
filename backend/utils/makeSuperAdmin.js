import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../model/user.model.js";

dotenv.config();

const email = "owner@hivehub.com";
async function makeSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOneAndUpdate(
      { email },
      { role: "superadmin" },
      { new: true }
    );

    if (user) {
      console.log(`✅ ${user.name} (${user.email}) is now a SuperAdmin`);
    } else {
      console.log(`❌ User with email ${email} not found`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

makeSuperAdmin();

// Then run the script
// node utils/makeSuperAdmin.js
