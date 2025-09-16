import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(`MongoDB connected ${connection.connection.host}`);
  } catch (error) {
    console.log("Data base connection failed!", error);
    process.exit(1);
  }
}
