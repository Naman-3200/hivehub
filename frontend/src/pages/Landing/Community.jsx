// import { useEffect, useState } from "react";
// import axios from "axios";

// const Community = () => {
//   const [posts, setPosts] = useState([]);
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Load user info from localStorage
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));

//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("https://hivehub-1.onrender.com/api/community", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPosts(res.data);
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//     }
//   };

//   const handlePost = async () => {
//     if (!content.trim()) return;
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post(
//         "https://hivehub-1.onrender.com/api/community",
//         { content },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPosts([res.data, ...posts]);
//       setContent("");
//     } catch (err) {
//       console.error("Error creating post:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Community</h1>

//       {/* Post box */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <div className="flex items-center space-x-3 mb-3">
//           <img
//             src={user?.profilePicture || "/default-avatar.png"}
//             alt="profile"
//             className="h-10 w-10 rounded-full object-cover"
//           />
//           <span className="text-gray-800 font-medium">{user?.name || "User"}</span>
//         </div>

//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="What's on your mind?"
//           className="w-full border rounded-md p-3 text-gray-700 focus:outline-none"
//         />
//         <button
//           onClick={handlePost}
//           disabled={loading}
//           className={`mt-3 px-4 py-2 rounded-lg text-white ${
//             loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Posting..." : "Post"}
//         </button>
//       </div>

//       {/* Posts feed */}
//       <div className="space-y-4">
//         {posts.length === 0 ? (
//           <p className="text-gray-500 text-center">No posts yet.</p>
//         ) : (
//           posts.map((p) => (
//             <div key={p._id} className="bg-white p-4 rounded-lg shadow">
//               <div className="flex items-center space-x-3">
//                 <img
//                   src={p.userId?.profilePicture || "/default-avatar.png"}
//                   alt="profile"
//                   className="h-10 w-10 rounded-full object-cover"
//                 />
//                 <p className="font-medium text-gray-900">{p.userId?.name}</p>
//               </div>
//               <p className="text-gray-700 mt-2">{p.content}</p>
//               <p className="text-xs text-gray-500 mt-1">
//                 {new Date(p.createdAt).toLocaleString()}
//               </p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Community;


import React, { useState, useEffect } from "react";
import axios from "axios";

const Community = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios defaults with token
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
      const res = await axios.get("https://hivehub-1.onrender.com/user/me"); // endpoint to get current user
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
      const res = await axios.get("https://hivehub-1.onrender.com/api/community");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !image) return alert("Post something!");
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      await axios.post("https://hivehub-1.onrender.com/api/community", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setContent("");
      setImage(null);
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post");
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post("https://hivehub-1.onrender.com/api/community/like", { postId });
      fetchPosts();
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      await axios.post("https://hivehub-1.onrender.com/api/community/comment", { postId, commentText });
      fetchPosts();
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user)
    return (
      <div className="text-center text-gray-700 mt-10">
        Please log in to view the community.
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Community</h1>

      {/* Create Post */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <textarea
          placeholder="What's on your mind?"
          className="w-full border rounded-md p-3 text-gray-700"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mt-2"
        />

        <button
          onClick={handlePost}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Post
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded-lg shadow">
            <p className="font-medium text-gray-900">{post.userName}</p>
            <p className="text-gray-700 mt-2">{post.content}</p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="mt-3 rounded-md max-h-60"
              />
            )}

            {/* Likes */}
            <button
              onClick={() => handleLike(post._id)}
              className="mt-3 text-blue-600"
            >
              👍 {post?.likes?.length}
            </button>

            {/* Comments */}
            <div className="mt-3">
              {post.comments.map((c, idx) => (
                <div key={idx} className="text-sm text-gray-700">
                  <strong>{c.userName}: </strong>
                  {c.commentText}
                </div>
              ))}

              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full border mt-2 rounded-md p-2 text-gray-700"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    handleComment(post._id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
