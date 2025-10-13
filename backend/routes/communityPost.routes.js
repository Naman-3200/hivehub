import express from "express";
import multer from "multer";
import {
  createPost,
  getPosts,
  toggleLike,
  addComment
} from "../controller/community.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), authenticateToken, createPost);
router.get("/", authenticateToken, getPosts);
router.post("/like", authenticateToken, toggleLike);
router.post("/comment", authenticateToken, addComment);

export default router;
