// models/community.model.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    commentText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const communityPostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // NEW: who can see this post
    visibility: {
      type: String,
      enum: ["all", "admins", "superadmins"],
      default: "all"
    },

    comments: [commentSchema]
  },
  { timestamps: true }
);

export default mongoose.model("CommunityPost", communityPostSchema);
