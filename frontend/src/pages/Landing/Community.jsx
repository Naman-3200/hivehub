import React, { useState, useEffect } from "react";
import axios from "axios";

const Community = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibility, setVisibility] = useState("all"); // ✅ Visibility State

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/user/me");
      setUser(res.data);
      fetchPosts();
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/community");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !image) return alert("Please write something!");
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("visibility", visibility); // ✅ Added visibility
      if (image) formData.append("image", image);

      await axios.post("http://localhost:8000/api/community", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setContent("");
      setImage(null);
      setVisibility("all");
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post");
    }
  };

  const handleLike = async (postId) => {
    await axios.post("http://localhost:8000/api/community/like", { postId });
    fetchPosts();
  };

  const handleComment = async (postId, commentText) => {
    await axios.post("http://localhost:8000/api/community/comment", {
      postId,
      commentText,
    });
    fetchPosts();
  };

  if (loading) return <div>Loading...</div>;
  if (!user)
    return (
      <div className="text-center text-gray-700 mt-10">
        Please log in to view the community.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight text-center">
          🌐 Community
        </h1>

        {/* Create Post */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
          <textarea
            placeholder="💭 What's on your mind?"
            className="w-full border border-gray-200 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[100px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-blue-600 font-medium hover:text-blue-700">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
              📷 Add Image
            </label>

            {/* ✅ Visibility Dropdown */}
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="border rounded-lg px-3 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Visible to everyone</option>
              <option value="admins">Admins only</option>
              <option value="superadmins">Superadmins only</option>
            </select>

            <button
              onClick={handlePost}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition-all"
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No posts yet — start the conversation! 💬
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 mb-6"
            >
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {post.userName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">{post.userName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-gray-800 text-sm mb-3">{post.content}</p>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="rounded-xl w-full object-cover max-h-80 mb-3"
                />
              )}

              {/* Actions */}
              <div className="flex items-center gap-6 text-gray-600 text-sm">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center hover:text-blue-600"
                >
                  👍 {post.likes?.length || 0}
                </button>
                <span>💬 {post.comments.length}</span>
              </div>

              {/* Comments */}
              <div className="mt-4 border-t border-gray-100 pt-3 space-y-2">
                {post.comments.map((c, i) => (
                  <div key={i} className="text-sm">
                    <strong>{c.userName}: </strong> {c.commentText}
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full border border-gray-200 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      handleComment(post._id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
