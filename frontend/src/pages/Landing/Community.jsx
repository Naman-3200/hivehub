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


// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Community = () => {
//   const [content, setContent] = useState("");
//   const [image, setImage] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [visibility, setVisibility] = useState("all"); // New state for visibility

//   // Set up axios defaults with token
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const res = await axios.get("https://hivehub-1.onrender.com/user/me"); // endpoint to get current user
//       setUser(res.data);
//       fetchPosts();
//     } catch (err) {
//       console.error("Error fetching user:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPosts = async () => {
//     try {
//       const res = await axios.get("https://hivehub-1.onrender.com/api/community");
//       setPosts(res.data);
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//     }
//   };

//   const handlePost = async () => {
//     if (!content.trim() && !image) return alert("Post something!");
//     try {
//       const formData = new FormData();
//       formData.append("content", content);
//       if (image) formData.append("image", image);

//       await axios.post("https://hivehub-1.onrender.com/api/community", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setContent("");
//       setImage(null);
//       fetchPosts();
//       setVisibility("all"); // Reset visibility to default
//     } catch (err) {
//       console.error("Error creating post:", err);
//       alert("Failed to create post");
//     }
//   };

//   const handleLike = async (postId) => {
//     try {
//       await axios.post("https://hivehub-1.onrender.com/api/community/like", { postId });
//       fetchPosts();
//     } catch (err) {
//       console.error("Error liking post:", err);
//     }
//   };

//   const handleComment = async (postId, commentText) => {
//     try {
//       await axios.post("https://hivehub-1.onrender.com/api/community/comment", { postId, commentText });
//       fetchPosts();
//     } catch (err) {
//       console.error("Error commenting:", err);
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!user)
//     return (
//       <div className="text-center text-gray-700 mt-10">
//         Please log in to view the community.
//       </div>
//     );

//   return (
//     // <div>
//     //   <h1 className="text-2xl font-bold text-gray-900 mb-6">Community</h1>

//     //   {/* Create Post */}
//     //   <div className="bg-white p-4 rounded-lg shadow mb-6">
//     //     <textarea
//     //       placeholder="What's on your mind?"
//     //       className="w-full border rounded-md p-3 text-gray-700"
//     //       value={content}
//     //       onChange={(e) => setContent(e.target.value)}
//     //     ></textarea>

//     //     <input
//     //       type="file"
//     //       accept="image/*"
//     //       onChange={(e) => setImage(e.target.files[0])}
//     //       className="mt-2"
//     //     />

//     //     <button
//     //       onClick={handlePost}
//     //       className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//     //     >
//     //       Post
//     //     </button>
//     //   </div>

//     //   {/* Posts */}
//     //   <div className="space-y-4">
//     //     {posts.map((post) => (
//     //       <div key={post._id} className="bg-white p-4 rounded-lg shadow">
//     //         <p className="font-medium text-gray-900">{post.userName}</p>
//     //         <p className="text-gray-700 mt-2">{post.content}</p>

//     //         {post.imageUrl && (
//     //           <img
//     //             src={post.imageUrl}
//     //             alt="Post"
//     //             className="mt-3 rounded-md max-h-60"
//     //           />
//     //         )}

//     //         {/* Likes */}
//     //         <button
//     //           onClick={() => handleLike(post._id)}
//     //           className="mt-3 text-blue-600"
//     //         >
//     //           👍 {post?.likes?.length}
//     //         </button>

//     //         {/* Comments */}
//     //         <div className="mt-3">
//     //           {post.comments.map((c, idx) => (
//     //             <div key={idx} className="text-sm text-gray-700">
//     //               <strong>{c.userName}: </strong>
//     //               {c.commentText}
//     //             </div>
//     //           ))}

//     //           <input
//     //             type="text"
//     //             placeholder="Add a comment..."
//     //             className="w-full border mt-2 rounded-md p-2 text-gray-700"
//     //             onKeyDown={(e) => {
//     //               if (e.key === "Enter" && e.target.value.trim()) {
//     //                 handleComment(post._id, e.target.value);
//     //                 e.target.value = "";
//     //               }
//     //             }}
//     //           />
//     //         </div>
//     //       </div>
//     //     ))}
//     //   </div>
//     // </div>

//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
//   <div className="max-w-3xl mx-auto">
//     {/* Header */}
//     <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight text-center">
//       🌐 Community
//     </h1>

//     {/* Create Post Card */}
//     <div className="bg-white rounded-2xl shadow-md p-5 mb-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
//       <textarea
//         placeholder="💭 What's on your mind?"
//         className="w-full border border-gray-200 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[100px] transition-all"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//       ></textarea>

//       <div className="flex items-center justify-between mt-3">
//         <label className="flex items-center gap-2 cursor-pointer text-blue-600 font-medium hover:text-blue-700">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setImage(e.target.files[0])}
//             className="hidden"
//           />
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828M19 13V7a2 2 0 00-2-2h-6" />
//           </svg>
//           Add Image
//         </label>

//         <select
//   value={visibility}
//   onChange={(e)=>setVisibility(e.target.value)}
//   className="mt-2 border rounded px-2 py-1"
// >
//   <option value="all">Visible to everyone</option>
//   <option value="admins">Admins only</option>
//   <option value="superadmins">Superadmins only</option>
// </select>

//         <button
//           onClick={handlePost}
//           className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition-all"
//         >
//           Post
//         </button>
//       </div>
//     </div>

//     {/* Posts Feed */}
//     <div className="space-y-6">
//       {posts.length === 0 ? (
//         <div className="text-center text-gray-500 mt-10">
//           No posts yet — start the conversation! 💬
//         </div>
//       ) : (
//         posts.map((post) => (
//           <div
//             key={post._id}
//             className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all"
//           >
//             {/* Header */}
//             <div className="flex items-center mb-3">
//               <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
//                 {post.userName?.charAt(0)?.toUpperCase()}
//               </div>
//               <div className="ml-3">
//                 <p className="font-semibold text-gray-900">{post.userName}</p>
//                 <p className="text-xs text-gray-500">just now</p>
//               </div>
//             </div>

//             {/* Content */}
//             <p className="text-gray-800 text-sm mb-3 leading-relaxed">{post.content}</p>

//             {post.imageUrl && (
//               <img
//                 src={post.imageUrl}
//                 alt="Post"
//                 className="rounded-xl w-full object-cover max-h-80 mb-3 shadow-sm"
//               />
//             )}

//             {/* Reactions */}
//             <div className="flex items-center space-x-6 mt-2">
//               <button
//                 onClick={() => handleLike(post._id)}
//                 className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
//               >
//                 <span className="text-lg mr-1">👍</span> {post?.likes?.length || 0}
//               </button>
//               <button className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
//                 💬 {post.comments.length}
//               </button>
//             </div>

//             {/* Comments */}
//             <div className="mt-4 border-t border-gray-100 pt-3 space-y-2">
//               {post.comments.map((c, idx) => (
//                 <div key={idx} className="text-sm text-gray-700">
//                   <span className="font-medium text-gray-900">{c.userName}: </span>
//                   {c.commentText}
//                 </div>
//               ))}

//               <input
//                 type="text"
//                 placeholder="Add a comment..."
//                 className="w-full border border-gray-200 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && e.target.value.trim()) {
//                     handleComment(post._id, e.target.value);
//                     e.target.value = "";
//                   }
//                 }}
//               />
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   </div>
// </div>


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
      const res = await axios.get("https://hivehub-1.onrender.com/user/me");
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
    if (!content.trim() && !image) return alert("Please write something!");
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("visibility", visibility); // ✅ Added visibility
      if (image) formData.append("image", image);

      await axios.post("https://hivehub-1.onrender.com/api/community", formData, {
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
    await axios.post("https://hivehub-1.onrender.com/api/community/like", { postId });
    fetchPosts();
  };

  const handleComment = async (postId, commentText) => {
    await axios.post("https://hivehub-1.onrender.com/api/community/comment", {
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
