import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['order','payment','system','feature','inventory','general','store'], 
    default: 'general' 
  },
  message: { type: String, required: true },
  icon: { type: String, default: '🔔' },
  meta: { type: mongoose.Schema.Types.Mixed }, // e.g. { orderId, productId, storeId }
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification", NotificationSchema);
