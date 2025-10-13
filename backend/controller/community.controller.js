import CommunityPost from "../model/community.model.js";
import cloudinary from "../config/cloudinary.js";
import User from "../model/user.model.js";



export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    let imageUrl = "";


    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      imageUrl = upload.secure_url;
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await CommunityPost.create({
      userId,
      userName: user.name,
      content,
      imageUrl
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Error creating post" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate("userId", "name profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;
    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.likes.indexOf(userId);
    if (index === -1) post.likes.push(userId);
    else post.likes.splice(index, 1);

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error liking post" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId, commentText } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const post = await CommunityPost.findById(postId);

    if (!user || !post) return res.status(404).json({ message: "Not found" });

    post.comments.push({
      userId,
      userName: user.name,
      commentText
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment" });
  }
};
