// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const StorePage = () => {
//   const { slug } = useParams();
//   const [storeData, setStoreData] = useState(null);
//   const [publishedProducts, setPublishedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cart, setCart] = useState([]);
//   const [storeUser, setStoreUser] = useState(
//     JSON.parse(localStorage.getItem("storeUser")) || null
//   );
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [authMode, setAuthMode] = useState("login");
//   const [authData, setAuthData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   console.log("store %%%%%%%%%%%%%",storeData);

//   const API_BASE = "https://hivehub-1.onrender.com/api/store-users";


  

//   useEffect(() => {
//     const fetchStoreData = async () => {
//       try {
//         const res = await fetch(`https://hivehub-1.onrender.com/api/stores/slug/${slug}`);
//         const data = await res.json();
//         setStoreData(data);
      
//         setPublishedProducts(data.publishedProducts || []);
//       } catch (err) {
//         console.error("Error loading store:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStoreData();
//   }, [slug]);


//   //   const handleCheckout = async () => {
//   //     console.log("Checkout clicked", storeUser, storeData);
//   //   if (!storeUser) {
//   //     alert("Please login before checkout.");
//   //     return;
//   //   }

//   //   if (cart.length === 0) {
//   //     alert("Your cart is empty.");
//   //     return;
//   //   }

//   //   try {
//   //     const res = await fetch("https://hivehub-1.onrender.com/api/orders/create", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         storeId: storeData.store._id || storeData.store.id,
//   //         userId: storeUser._id,
//   //         items: cart.map((item) => ({
//   //           productId: item.productId,
//   //           name: item.name,
//   //           price: item.sellingPrice || item.price,
//   //           quantity: item.quantity || 1,
//   //         })),
//   //         total: cart.reduce(
//   //           (sum, item) => sum + (item.sellingPrice || item.price),
//   //           0
//   //         ),
//   //       }),
//   //     });

//   //     const data = await res.json();

//   //     if (res.ok) {
//   //       alert("Order placed successfully!");
//   //       setCart([]); // Clear cart
//   //     } else {
//   //       alert(data.message || "Failed to place order");
//   //     }
//   //   } catch (error) {
//   //     console.error("Checkout error:", error);
//   //     alert("Something went wrong. Please try again.");
//   //   }
//   // };

//     const handleCheckout = async () => {
//     if (!storeUser) {
//       alert("Please login before checking out.");
//       return;
//     }

//     if (cart.length === 0) {
//       alert("Your cart is empty.");
//       return;
//     }

//     try {
//       const storeId = storeData?.store?._id || storeData?.store?.id;
//       const userId = storeUser?._id || storeUser?.id;

//       if (!storeId || !userId) {
//         alert("Missing store or user information. Please refresh and try again.");
//         return;
//       }

//       // Calculate total safely
//       const total = cart.reduce(
//         (sum, item) => sum + Number(item.sellingPrice || item.price || 0),
//         0
//       );

//       const orderData = {
//         storeId,
//         userId,
//         items: cart.map((product) => ({
//           productId: product._id || product.id || product.productId,
//           name: product.name,
//           price: product.sellingPrice || product.price,
//           quantity: 1,
//         })),
//         total,
//       };

//       const res = await fetch("https://hivehub-1.onrender.com/api/orders/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("✅ Order placed successfully!");
//         setCart([]); // clear cart
//       } else {
//         alert(data.message || "Failed to place order");
//       }
//     } catch (err) {
//       console.error("Checkout error:", err);
//       alert("Error placing order: " + err.message);
//     }
//   };



//   const openModal = (mode) => {
//     setAuthMode(mode);
//     setShowAuthModal(true);
//     setAuthData({ name: "", email: "", password: "" });
//   };

//   const handleAuthSubmit = async (e) => {
//     e.preventDefault();

//     if (!storeData?.store?._id && !storeData?.store?.id) {
//       alert("Store ID not found, please refresh the page.");
//       return;
//     }

//     const endpoint =
//       authMode === "login" ? `${API_BASE}/login` : `${API_BASE}/register`;

//     const body =
//       authMode === "login"
//         ? {
//             email: authData.email,
//             password: authData.password,
//             storeId: storeData._id || storeData.id,
//           }
//         : {
//             name: authData.name,
//             email: authData.email,
//             password: authData.password,
//             storeId: storeData?.store?._id || storeData?.store?.id,
//           };

//     try {
//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setStoreUser(data.user);
//         localStorage.setItem("storeUser", JSON.stringify(data.user));
//         alert(`${authMode === "login" ? "Login" : "Registration"} successful!`);
//         setShowAuthModal(false);
//       } else {
//         alert(data.message || "Something went wrong");
//       }
//     } catch (err) {
//       alert("Network error: " + err.message);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("storeUser");
//     setStoreUser(null);
//     alert("Logged out successfully");
//   };

//   const addToCart = (product) => {
//     setCart((prev) => [...prev, product]);
//   };

//   if (loading) return <div className="text-center py-20">Loading store...</div>;
//   if (!storeData) return <div className="text-center py-20">Store not found</div>;

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {storeData.store.name}
//               </h1>
//               <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
//                 {storeData.store.name || "Store"}
//               </span>
//             </div>

//             <nav className="flex space-x-8 items-center">
//               <a href="#products" className="text-gray-600 hover:text-gray-900">
//                 Products
//               </a>

//               {/* 🛒 Cart */}
//               {/* <div className="relative">
//                 <span className="text-gray-600 text-xl">🛒</span>
//                 {cart.length > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
//                     {cart.length}
//                   </span>
//                 )}
//               </div> */}

//               <div className="relative flex items-center space-x-2">
//   <span className="text-gray-600 text-xl">🛒</span>
//   {cart.length > 0 && (
//     <>
//       <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
//         {cart.length}
//       </span>
//       <button
//         onClick={handleCheckout}
//         className="ml-4 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
//       >
//         Checkout
//       </button>
//     </>
//   )}
// </div>


//               {/* 👤 Auth */}
//               {storeUser ? (
//                 <div className="flex items-center space-x-4">
//                   <span className="text-gray-700 font-medium">
//                     Welcome, {storeUser.name}
//                   </span>
//                   <button
//                     onClick={handleLogout}
//                     className="text-red-600 hover:text-red-800 font-medium"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={() => openModal("login")}
//                     className="text-gray-700 hover:text-gray-900 font-medium"
//                   >
//                     Login
//                   </button>
//                   <button
//                     onClick={() => openModal("register")}
//                     className="text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     Register
//                   </button>
//                 </div>
//               )}
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Hero */}
//       <section className="hero-gradient text-white py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-4xl font-bold mb-4">Welcome to {storeData.name}</h2>
//           <p className="text-xl mb-8">
//             {storeData.description ||
//               `Your trusted ${storeData.store.name} store with amazing products!`}
//           </p>
//           <a
//             href="#products"
//             className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
//           >
//             Shop Now
//           </a>
//         </div>
//       </section>

//       {/* Products */}
//       <section id="products" className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
//             Our Products
//           </h2>

//           {publishedProducts.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-6xl mb-4">📦</div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 Coming Soon!
//               </h3>
//               <p className="text-gray-600">
//                 We're adding amazing products to our store. Check back soon!
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               {publishedProducts.map((product) => (
//                 <div
//                   key={product.productId}
//                   className="product-card bg-white rounded-lg shadow-md overflow-hidden"
//                 >
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-48 object-cover"
//                     onError={(e) =>
//                       (e.target.src =
//                         "https://via.placeholder.com/300x300/4F46E5/white?text=Product")
//                     }
//                   />
//                   <div className="p-6">
//                     <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
//                       {product.name}
//                     </h3>
//                     <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                       {product.description}
//                     </p>
//                     <div className="flex items-center justify-between mb-3">
//                       <div>
//                         <span className="text-lg font-bold text-gray-900">
//                           ${product.sellingPrice || product.price}
//                         </span>
//                         {product.originalPrice && (
//                           <span className="ml-2 text-sm text-gray-500 line-through">
//                             ${product.originalPrice}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => addToCart(product)}
//                       className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer class="bg-gray-900 text-white py-12">
//         <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
//                 <div>
//                     <h3 class="text-lg font-semibold mb-4">{storeData.store.name}</h3>
//                     <p class="text-gray-400">Your trusted online {storeData.store.name   } store.</p>
//                 </div>
//                 <div>
//                     <h4 class="font-semibold mb-4">Quick Links</h4>
//                     <ul class="space-y-2 text-gray-400">
//                         <li><a href="#products" class="hover:text-white">Products</a></li>
//                         <li><a href="#about" class="hover:text-white">About Us</a></li>
//                         <li><a href="#contact" class="hover:text-white">Contact</a></li>
//                     </ul>
//                 </div>
//                 <div>
//                     <h4 class="font-semibold mb-4">Support</h4>
//                     <ul class="space-y-2 text-gray-400">
//                         <li><a href="#" class="hover:text-white">Help Center</a></li>
//                         <li><a href="#" class="hover:text-white">Returns</a></li>
//                         <li><a href="#" class="hover:text-white">Shipping Info</a></li>
//                     </ul>
//                 </div>
//                 <div>
//                     <h4 class="font-semibold mb-4">Contact Info</h4>
//                     <div class="text-gray-400 space-y-2">
//                         <p>📧 info@{storeData.store.name.toLowerCase().replace(/\s+/g, '')}.com</p>
//                         <p>📞 +1 (555) 123-4567</p>
//                         <p>📍 123 Business St, City, State</p>
//                     </div>
//                 </div>
//             </div>
//             <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//                 <p>&copy; 2024 ${storeData.store.name}. All rights reserved. | Powered by DropShip Pro</p>
//             </div>
//         </div>
//     </footer>

//       {/* 🔐 Auth Modal */}
//       {showAuthModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//             <h2 className="text-2xl font-bold mb-4 text-center">
//               {authMode === "login" ? "Login" : "Register"}
//             </h2>
//             <form onSubmit={handleAuthSubmit} className="space-y-4">
//               {authMode === "register" && (
//                 <input
//                   type="text"
//                   placeholder="Full Name"
//                   value={authData.name}
//                   onChange={(e) =>
//                     setAuthData({ ...authData, name: e.target.value })
//                   }
//                   className="w-full border p-2 rounded"
//                   required
//                 />
//               )}
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={authData.email}
//                 onChange={(e) =>
//                   setAuthData({ ...authData, email: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={authData.password}
//                 onChange={(e) =>
//                   setAuthData({ ...authData, password: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
//               >
//                 {authMode === "login" ? "Login" : "Register"}
//               </button>
//             </form>
//             <button
//               onClick={() => setShowAuthModal(false)}
//               className="mt-4 w-full text-gray-500 hover:text-gray-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StorePage;











// // import React, { useState, useEffect } from "react";
// // import { useParams } from "react-router-dom";

// // const StorePage = () => {
// //   const { slug } = useParams();
// //   const [storeData, setStoreData] = useState(null);
// //   const [publishedProducts, setPublishedProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [cart, setCart] = useState([]);
// //   const [storeUser, setStoreUser] = useState(
// //     JSON.parse(localStorage.getItem("storeUser")) || null
// //   );
// //   const [showAuthModal, setShowAuthModal] = useState(false);
// //   const [authMode, setAuthMode] = useState("login");
// //   const [authData, setAuthData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //   });

// //   const API_BASE = "https://hivehub-1.onrender.com/api/store-users";
// //   const ORDER_API = "https://hivehub-1.onrender.com/api/orders"; // 🧾 backend endpoint to create order

// //   useEffect(() => {
// //     const fetchStoreData = async () => {
// //       try {
// //         const res = await fetch(`https://hivehub-1.onrender.com/api/stores/slug/${slug}`);
// //         const data = await res.json();
// //         setStoreData(data);
// //         setPublishedProducts(data.publishedProducts || []);
// //       } catch (err) {
// //         console.error("Error loading store:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchStoreData();
// //   }, [slug]);

// //   const openModal = (mode) => {
// //     setAuthMode(mode);
// //     setShowAuthModal(true);
// //     setAuthData({ name: "", email: "", password: "" });
// //   };

// //   const handleAuthSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!storeData?.store?._id && !storeData?.store?.id) {
// //       alert("Store ID not found, please refresh the page.");
// //       return;
// //     }

// //     const endpoint =
// //       authMode === "login" ? `${API_BASE}/login` : `${API_BASE}/register`;

// //     const body =
// //       authMode === "login"
// //         ? {
// //             email: authData.email,
// //             password: authData.password,
// //             storeId: storeData._id || storeData.id,
// //           }
// //         : {
// //             name: authData.name,
// //             email: authData.email,
// //             password: authData.password,
// //             storeId: storeData?.store?._id || storeData?.store?.id,
// //           };

// //     try {
// //       const res = await fetch(endpoint, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(body),
// //       });

// //       const data = await res.json();

// //       if (res.ok) {
// //         setStoreUser(data.user);
// //         localStorage.setItem("storeUser", JSON.stringify(data.user));
// //         alert(`${authMode === "login" ? "Login" : "Registration"} successful!`);
// //         setShowAuthModal(false);
// //       } else {
// //         alert(data.message || "Something went wrong");
// //       }
// //     } catch (err) {
// //       alert("Network error: " + err.message);
// //     }
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("storeUser");
// //     setStoreUser(null);
// //     alert("Logged out successfully");
// //   };

// //   const addToCart = (product) => {
// //     setCart((prev) => [...prev, product]);
// //   };

// //   // ✅ NEW FUNCTION — Handle Checkout
// //   const handleCheckout = async () => {
// //     if (!storeUser) {
// //       alert("Please login before checkout.");
// //       return;
// //     }

// //     if (cart.length === 0) {
// //       alert("Your cart is empty.");
// //       return;
// //     }

// //     try {
// //       const orderData = {
// //         storeId: storeData?.store?._id || storeData?.store?.id,
// //         userId: storeUser._id,
// //         items: cart.map((item) => ({
// //           productId: item._id || item.productId,
// //           name: item.name,
// //           price: item.sellingPrice || item.price,
// //           quantity: 1,
// //         })),
// //         totalAmount: cart.reduce(
// //           (acc, item) => acc + (item.sellingPrice || item.price),
// //           0
// //         ),
// //         paymentStatus: "Pending",
// //         orderStatus: "Created",
// //         createdAt: new Date(),
// //       };

// //       const res = await fetch(ORDER_API, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //         body: JSON.stringify(orderData),
// //       });

// //       const data = await res.json();

// //       if (res.ok) {
// //         alert("✅ Order placed successfully!");
// //         setCart([]);
// //         console.log("Order created:", data);

// //         // Optional KPI trigger
// //         await fetch("https://hivehub-1.onrender.com/api/kpis/update-orders", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             storeId: orderData.storeId,
// //             totalSales: orderData.totalAmount,
// //             totalOrders: 1,
// //           }),
// //         });
// //       } else {
// //         alert(data.message || "Order failed. Try again.");
// //       }
// //     } catch (err) {
// //       console.error("Checkout error:", err);
// //       alert("Error during checkout: " + err.message);
// //     }
// //   };

// //   if (loading) return <div className="text-center py-20">Loading store...</div>;
// //   if (!storeData) return <div className="text-center py-20">Store not found</div>;

// //   return (
// //     <div className="bg-gray-50 min-h-screen">
// //       {/* Header */}
// //       <header className="bg-white shadow-sm">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center h-16">
// //             <div className="flex items-center">
// //               <h1 className="text-2xl font-bold text-gray-900">
// //                 {storeData.store.name}
// //               </h1>
// //             </div>

// //             <nav className="flex space-x-8 items-center">
// //               <a href="#products" className="text-gray-600 hover:text-gray-900">
// //                 Products
// //               </a>

// //               {/* 🛒 Cart */}
// //               <div className="relative">
// //                 <span className="text-gray-600 text-xl">🛒</span>
// //                 {cart.length > 0 && (
// //                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
// //                     {cart.length}
// //                   </span>
// //                 )}
// //               </div>

// //               {/* 👤 Auth */}
// //               {storeUser ? (
// //                 <div className="flex items-center space-x-4">
// //                   <span className="text-gray-700 font-medium">
// //                     Welcome, {storeUser.name}
// //                   </span>
// //                   <button
// //                     onClick={handleLogout}
// //                     className="text-red-600 hover:text-red-800 font-medium"
// //                   >
// //                     Logout
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <div className="flex items-center space-x-4">
// //                   <button
// //                     onClick={() => openModal("login")}
// //                     className="text-gray-700 hover:text-gray-900 font-medium"
// //                   >
// //                     Login
// //                   </button>
// //                   <button
// //                     onClick={() => openModal("register")}
// //                     className="text-blue-600 hover:text-blue-800 font-medium"
// //                   >
// //                     Register
// //                   </button>
// //                 </div>
// //               )}
// //             </nav>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Products */}
// //       <section id="products" className="py-16">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
// //             Our Products
// //           </h2>

// //           {publishedProducts.length === 0 ? (
// //             <div className="text-center py-12 text-gray-500">
// //               No products available yet.
// //             </div>
// //           ) : (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// //               {publishedProducts.map((product) => (
// //                 <div
// //                   key={product.productId}
// //                   className="product-card bg-white rounded-lg shadow-md overflow-hidden"
// //                 >
// //                   <img
// //                     src={product.image}
// //                     alt={product.name}
// //                     className="w-full h-48 object-cover"
// //                   />
// //                   <div className="p-6">
// //                     <h3 className="font-semibold text-gray-900 mb-2">
// //                       {product.name}
// //                     </h3>
// //                     <p className="text-gray-600 text-sm mb-3 line-clamp-2">
// //                       {product.description}
// //                     </p>
// //                     <div className="flex items-center justify-between mb-3">
// //                       <span className="text-lg font-bold text-gray-900">
// //                         ${product.sellingPrice || product.price}
// //                       </span>
// //                     </div>
// //                     <button
// //                       onClick={() => addToCart(product)}
// //                       className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
// //                     >
// //                       Add to Cart
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         {/* Checkout Button */}
// //         {cart.length > 0 && (
// //           <div className="flex justify-center mt-8">
// //             <button
// //               onClick={handleCheckout}
// //               className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
// //             >
// //               Proceed to Checkout ({cart.length} items)
// //             </button>
// //           </div>
// //         )}
// //       </section>
// //     </div>
// //   );
// // };

// // export default StorePage;





















import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CheckoutButton from "./CheckoutButton";

const StorePage = () => {
  const { slug } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [publishedProducts, setPublishedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [storeUser, setStoreUser] = useState(
    JSON.parse(localStorage.getItem("storeUser")) || null
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authData, setAuthData] = useState({ name: "", email: "", password: "" });

  const API_BASE = "https://hivehub-1.onrender.com/api/store-users";

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const res = await fetch(`https://hivehub-1.onrender.com/api/stores/slug/${slug}`);
        const data = await res.json();
        setStoreData(data);
        setPublishedProducts(data.publishedProducts || []);
      } catch (err) {
        console.error("Error loading store:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [slug]);

  const openModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setAuthData({ name: "", email: "", password: "" });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!storeData?.store?._id && !storeData?.store?.id) {
      alert("Store ID not found, please refresh the page.");
      return;
    }
    const endpoint =
      authMode === "login" ? `${API_BASE}/login` : `${API_BASE}/register`;
    const body =
      authMode === "login"
        ? {
            email: authData.email,
            password: authData.password,
            storeId: storeData._id || storeData.id,
          }
        : {
            name: authData.name,
            email: authData.email,
            password: authData.password,
            storeId: storeData.store?._id || storeData.store?.id,
          };
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setStoreUser(data.user);
        localStorage.setItem("storeUser", JSON.stringify(data.user));
        alert(`${authMode === "login" ? "Login" : "Registration"} successful!`);
        setShowAuthModal(false);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("storeUser");
    setStoreUser(null);
    alert("Logged out successfully");
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // New: Payment checkout
  // const handleCheckout = async () => {
  //   if (!storeUser) {
  //     alert("Please login to proceed with payment");
  //     return;
  //   }
  //   if (cart.length === 0) {
  //     alert("Cart is empty");
  //     return;
  //   }
  //   try {
  //     const token = localStorage.getItem("token"); // assuming you store JWT
  //     const total = cart.reduce((sum, p) => sum + (p.sellingPrice || p.price || 0), 0);
  //     const planId = "plan_UdnQYRP0wu87q?d2c"; // **Replace** with your actual plan ID from Whop

  //     const metadata = {
  //       items: cart.map((p) => ({ productId: p.productId, name: p.name, price: p.sellingPrice || p.price })),
  //       totalPrice: total,
  //       storeId: storeData.store?._id || storeData.store?.id,
  //       redirectUrl: `https://hivehub-tr8u.vercel.app/payment-success`, // where user returns after payment
  //     };

  //     const res = await axios.post(
  //       "https://hivehub-1.onrender.com/api/whop/checkout",
  //       { planId, metadata },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     // const { purchaseUrl } = res.data;
  //     // redirect user to payment
  //     // window.location.href = purchaseUrl;
  //         const redirectUrl = encodeURIComponent("https://hivehub-tr8u.vercel.app/payment-success");

  //     window.location.href = `https://whop.com/checkout/${planId}?redirect_url=${redirectUrl}`;
  //   } catch (err) {
  //     console.error("Payment error:", err.response?.data || err.message);
  //     alert("Failed to initiate payment. Please try again.");
  //   }
  // };

  if (loading) return <div className="text-center py-20">Loading store...</div>;
  if (!storeData) return <div className="text-center py-20">Store not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{storeData.store.name}</h1>
              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
                {storeData.store.name || "Store"}
              </span>
            </div>

            <nav className="flex space-x-8 items-center">
              <a href="#products" className="text-gray-600 hover:text-gray-900">
                Products
              </a>

              {/* 🛒 Cart icon */}
              <div className="relative cursor-pointer" onClick={() => alert("Cart items: " + cart.length)}>
                <span className="text-gray-600 text-xl">🛒</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>

              {/* 👤 Auth */}
              {storeUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Welcome, {storeUser.name}</span>
                  <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium">Logout</button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button onClick={() => openModal("login")} className="text-gray-700 hover:text-gray-900 font-medium">Login</button>
                  <button onClick={() => openModal("register")} className="text-blue-600 hover:text-blue-800 font-medium">Register</button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-gradient text-white py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to {storeData.name}</h2>
          <p className="text-xl mb-8">
            {storeData.description || `Your trusted ${storeData.store.name} store with amazing products!`}
          </p>
          <a href="#products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Shop Now
          </a>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Products</h2>

          {publishedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
              <p className="text-gray-600">We're adding amazing products to our store. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {publishedProducts.map((product) => (
                <div key={product.productId} className="product-card bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/300x300/4F46E5/white?text=Product")}
                  />
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-gray-900">${product.sellingPrice || product.price}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => addToCart(product)} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl">
          {/* <button onClick={handleCheckout} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
            Checkout & Pay ₹{cart.reduce((sum, p) => sum + (p.sellingPrice || p.price || 0), 0).toFixed(2)}
          </button> */}
          <CheckoutButton planId="plan_UdnQYRP0wu87q" />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{storeData.store.name}</h3>
              <p className="text-gray-400">Your trusted online {storeData.store.name} store.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#products" className="hover:text-white">Products</a></li>
                <li><a href="#about" className="hover:text-white">About Us</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="text-gray-400 space-y-2">
                <p>📧 info@{storeData.store.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>📍 123 Business St, City, State</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} {storeData.store.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">{authMode === "login" ? "Login" : "Register"}</h2>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "register" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={authData.name}
                  onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={authData.email}
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
                {authMode === "login" ? "Login" : "Register"}
              </button>
            </form>
            <button onClick={() => setShowAuthModal(false)} className="mt-4 w-full text-gray-500 hover:text-gray-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorePage;
