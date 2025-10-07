// // // // src/pages/StoreBuilder.js
// // // import React, { useEffect, useRef } from "react";
// // // import grapesjs from "grapesjs";
// // // import "grapesjs/dist/css/grapes.min.css";
// // // import { generateWebsiteContent } from "../generateWebsiteContent.jsx";
// // // import { useLocation } from "react-router-dom";


// // // const WebEditor = () => {

// // //    const location = useLocation();
// // //   const { store, publishedProducts } = location.state || {};

// // //   if (!store) return <div>Loading store...</div>;
// // //   console.log("🛒 Store data in WebEditor:", store);
// // //   console.log("📦 Published products in WebEditor:", publishedProducts);
// // //   const editorRef = useRef(null);
// // //   const editorInstance = useRef(null);

// // //   useEffect(() => {
// // //     if (editorInstance.current) return;

// // //     // Initialize GrapesJS
// // //     editorInstance.current = grapesjs.init({
// // //       container: editorRef.current,
// // //       fromElement: false,
// // //       height: "100vh",
// // //       width: "auto",
// // //       storageManager: false, // disable auto-save for now
// // //       plugins: [],
// // //       canvas: {
// // //         scripts: [
// // //           "https://cdn.tailwindcss.com", // ✅ your store template uses Tailwind
// // //         ],
// // //       },
// // //     });

// // //     // Load your generated store HTML into GrapesJS
// // //     const html = generateWebsiteContent(store, publishedProducts);
// // //     editorInstance.current.setComponents(html);
// // //   }, [store, publishedProducts]);

// // //   const handleSave = async () => {
// // //     const editor = editorInstance.current;
// // //     const html = editor.getHtml();
// // //     const css = editor.getCss();

// // //     const combinedHtml = `
// // //       <html>
// // //         <head><style>${css}</style></head>
// // //         <body>${html}</body>
// // //       </html>
// // //     `;

// // //     // Call backend API to save HTML in MongoDB
// // //     try {
// // //     const res = await fetch(`https://hivehub-1.onrender.com/api/stores/${store._id}/website`, {
// // //       method: "PUT",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({ websiteHtml: combinedHtml }),
// // //     });

// // //     const data = await res.json();
// // //     if (res.ok) alert("✅ Store design saved successfully!");
// // //     else alert(`❌ Failed to save: ${data.error}`);
// // //   } catch (err) {
// // //     alert("⚠️ Error saving store design.");
// // //     console.error(err);
// // //   }
// // // }

// // //   return (
// // //   <div className="flex flex-col h-screen">
// // //     <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
// // //       <h1 className="text-xl font-semibold">{store?.name} — Store Editor</h1>
// // //       <button
// // //         onClick={handleSave}
// // //         className="bg-blue-600 text-white px-4 py-2 rounded-lg"
// // //       >
// // //         Save Changes
// // //       </button>
// // //     </div>
// // //     <div ref={editorRef} className="flex-1"></div>
// // //   </div>
// // // );
// // // };

// // // export default WebEditor;







// // import React, { useEffect, useRef } from "react";
// // import grapesjs from "grapesjs";
// // import "grapesjs/dist/css/grapes.min.css";
// // import { generateWebsiteContent } from "../generateWebsiteContent.jsx";
// // import { useLocation } from "react-router-dom";

// // const WebEditor = () => {
// //   const location = useLocation();
// //   const { store, publishedProducts } = location.state || {};

// //   const editorRef = useRef(null);
// //   const editorInstance = useRef(null);

// // //   useEffect(() => {
// // //     if (!store || editorInstance.current) return; // ✅ check inside effect, not before hooks

// // //     const editor = grapesjs.init({
// // //       container: editorRef.current,
// // //       height: "100vh",
// // //       width: "auto",
// // //       storageManager: false,
// // //       plugins: [],
// // //       canvas: { scripts: ["https://cdn.tailwindcss.com"] },
// // //     });

// // //     // Prefer the saved HTML from database; fall back to generated one
// // // const html = store.websiteHtml && store.websiteHtml.trim() !== ""
// // //   ? store.websiteHtml
// // //   : generateWebsiteContent(store, publishedProducts);

// // // editorInstance.current.setComponents(html);

// // //     editorInstance.current = editor;
// // //   }, [store, publishedProducts]);


// // useEffect(() => {
// //   // 🛑 only run if we have store and editorRef mounted
// //   if (!store || !editorRef.current) return;

// //   // 🛑 prevent re-initialization
// //   if (editorInstance.current) {
// //     // If editor exists and store updates, just update content
// //     const html =
// //       store.websiteHtml && store.websiteHtml.trim() !== ""
// //         ? store.websiteHtml
// //         : generateWebsiteContent(store, publishedProducts);

// //     editorInstance.current.setComponents(html);
// //     return;
// //   }

// //   // ✅ Initialize GrapesJS
// //   // const editor = grapesjs.init({
// //   //   container: editorRef.current,
// //   //   fromElement: false,
// //   //   height: "100vh",
// //   //   width: "auto",
// //   //   storageManager: false,
// //   //   plugins: [],
// //   //   canvas: {
// //   //     styles: ["https://cdn.tailwindcss.com"],
// //   //   },
// //   // });


// //   const editor = grapesjs.init({
// //   container: "#editor",
// //   fromElement: true,
// //   height: "100vh",
// //   storageManager: false,
// //   canvas: {
// //     styles: [
// //       "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
// //     ],
// //     scripts: [
// //       "https://cdn.tailwindcss.com",
// //     ],
// //   },
// // });

// //   editorInstance.current = editor;

// //   // // ✅ Now safely set content
// //   // const html =
// //   //   store.websiteHtml && store.websiteHtml.trim() !== ""
// //   //     ? store.websiteHtml
// //   //     : generateWebsiteContent(store, publishedProducts);

// //   // editor.setComponents(html);

// //   // ✅ Wait until GrapesJS canvas is fully ready
// // editor.on("load", () => {
// //   let htmlContent =
// //     store.websiteHtml && store.websiteHtml.trim() !== ""
// //       ? store.websiteHtml
// //       : generateWebsiteContent(store, publishedProducts);

// //   // 🧠 Ensure TailwindCSS is included (for styling to work)
// //   if (!htmlContent.includes("cdn.tailwindcss.com")) {
// //     htmlContent = htmlContent.replace(
// //       /<head>/i,
// //       `<head><script src="https://cdn.tailwindcss.com"></script>`
// //     );
// //   }

// //   // 🧹 Clear previous components before loading new ones
// //   if (editor && editor.DomComponents) {
// //     editor.DomComponents.clear();
// //     editor.setComponents(htmlContent);
// //     console.log("✅ Store design loaded successfully into GrapesJS");
// //   }
// // });

// // }, [store, publishedProducts]);


// //   // const handleSave = async () => {
// //   //   if (!editorInstance.current) return;
// //   //   const editor = editorInstance.current;

// //   //   const html = editor.getHtml();
// //   //   const css = editor.getCss();

// //   //   const combinedHtml = `
// //   //     <html>
// //   //       <head><style>${css}</style></head>
// //   //       <body>${html}</body>
// //   //     </html>
// //   //   `;

// //   //   try {
// //   //     const res = await fetch(`https://hivehub-1.onrender.com/api/stores/stores/${store._id}/website`, {
// //   //       method: "PUT",
// //   //       headers: { "Content-Type": "application/json" },
// //   //       body: JSON.stringify({ websiteHtml: combinedHtml }),
// //   //     });

// //   //     const data = await res.json();
// //   //     if (res.ok) alert("✅ Store design saved successfully!");
// //   //     else alert(`❌ Failed to save: ${data.error}`);
// //   //   } catch (err) {
// //   //     alert("⚠️ Error saving store design.");
// //   //     console.error(err);
// //   //   }
// //   // };

// //   const handleSave = async () => {
// //   const editor = editorInstance.current;
// //   const html = editor.getHtml();
// //   const css = editor.getCss();

// //   // ✅ Add Tailwind CSS link in the head
// //   const combinedHtml = `
// //     <html>
// //       <head>
// //         <meta charset="UTF-8" />
// //         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
// //         <script src="https://cdn.tailwindcss.com"></script>
// //         <style>${css}</style>
// //       </head>
// //       <body>${html}</body>
// //     </html>
// //   `;

// //   await fetch(`https://hivehub-1.onrender.com/api/stores/stores/${store._id}/website`, {
// //     method: "PUT",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ websiteHtml: combinedHtml }),
// //   });

// //   alert("✅ Store design saved successfully!");
// // };


// //   if (!store) {
// //     return <div className="p-6 text-gray-700">Loading store...</div>;
// //   }

// //   return (
// //     <div className="flex flex-col h-screen">
// //       <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
// //         <h1 className="text-xl font-semibold">{store?.name} — Store Editor</h1>
// //         <button
// //           onClick={handleSave}
// //           className="bg-blue-600 text-white px-4 py-2 rounded-lg"
// //         >
// //           Save Changes
// //         </button>
// //       </div>
// //       <div ref={editorRef} className="flex-1"></div>
// //     </div>
// //   );
// // };

// // export default WebEditor;






// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import grapesjs from "grapesjs";
// import "grapesjs/dist/css/grapes.min.css";
// import gjsPresetWebpage from "grapesjs-preset-webpage";

// const WebEditor = () => {
//   const location = useLocation();
//   const { storeId } = useParams();

//   // Get data passed via navigate()
//   const { store, publishedProducts } = location.state || {};

//   const editorRef = useRef(null);
//   const editorInstanceRef = useRef(null);
//     const editorContainerRef = useRef(null);

//   const [isReady, setIsReady] = useState(false);

//   // ✅ Initialize GrapesJS editor once
//   useEffect(() => {
//     if (editorInstanceRef.current || !editorRef.current) return;

//     const editor = grapesjs.init({
//   container: editorContainerRef.current,
//   height: "100vh",
//   width: "auto",
//   storageManager: {
//     type: "local",
//     autosave: true,
//     autoload: false,
//   },
//   plugins: [gjsPresetWebpage],
//   pluginsOpts: {
//     [gjsPresetWebpage]: {},
//   },
//   canvas: {
//     styles: [
//       "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css", // ✅ Tailwind inside canvas
//     ],
//     scripts: [
//       "https://cdn.tailwindcss.com", // ✅ ensures Tailwind JS runs inside iframe
//     ],
//   },
//   deviceManager: {
//     devices: [
//       { name: "Desktop", width: "" },
//       { name: "Tablet", width: "768px", widthMedia: "991px" },
//       { name: "Mobile", width: "375px", widthMedia: "767px" },
//     ],
//   },
// });

//     editorInstanceRef.current = editor;
//     setIsReady(true);
//   }, []);




//   useEffect(() => {
//     if (!editorContainerRef.current) return;

//     // 🧹 Clear any corrupted data
//     try {
//       const saved = localStorage.getItem("gjs-project");
//       if (saved && saved.includes("elevate")) {
//         Object.keys(localStorage)
//           .filter((k) => k.startsWith("gjs"))
//           .forEach((k) => localStorage.removeItem(k));
//       }
//     } catch (err) {
//       console.warn("LocalStorage cleanup failed:", err);
//     }

//     // ✅ Initialize GrapesJS editor
//     const editor = grapesjs.init({
//       container: editorContainerRef.current,
//       height: "100vh",
//       width: "auto",
//       storageManager: {
//         type: "local",
//         autosave: true,
//         autoload: false,
//       },
//       plugins: [gjsPresetWebpage],
//       pluginsOpts: {
//         [gjsPresetWebpage]: {},
//       },
//       canvas: {
//         styles: [
//           "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
//         ],
//       },
//       deviceManager: {
//         devices: [
//           { name: "Desktop", width: "" },
//           { name: "Tablet", width: "768px", widthMedia: "991px" },
//           { name: "Mobile", width: "375px", widthMedia: "767px" },
//         ],
//       },
//       panels: { defaults: [] },
//     });

//     // ✅ Add top bar with device + undo/redo/clear
//     const topPanel = document.createElement("div");
//     topPanel.className =
//       "flex justify-between items-center bg-gray-100 p-2 border-b gjs-custom-topbar";
//     topPanel.innerHTML = `
//       <div class="flex gap-2 panel__devices"></div>
//       <div class="flex gap-2 panel__options"></div>
//       <div class="flex gap-2 panel__views"></div>
//     `;
//     editorContainerRef.current.before(topPanel);

//     const pn = editor.Panels;

//     pn.addPanel({ id: "devices-panel", el: ".panel__devices" }).get("buttons").add([
//       { id: "device-desktop", label: "🖥️", command: () => editor.setDevice("Desktop"), active: true },
//       { id: "device-tablet", label: "📱", command: () => editor.setDevice("Tablet") },
//       { id: "device-mobile", label: "📲", command: () => editor.setDevice("Mobile") },
//     ]);

//     pn.addPanel({ id: "options-panel", el: ".panel__options" }).get("buttons").add([
//       { id: "undo", label: "↩️", command: "core:undo" },
//       { id: "redo", label: "↪️", command: "core:redo" },
//       { id: "clear", label: "🗑️", command: () => editor.runCommand("core:canvas-clear") },
//     ]);

//     pn.addPanel({ id: "views-panel", el: ".panel__views" }).get("buttons").add([
//       { id: "open-blocks", label: "Blocks", command: "open-blocks", togglable: true },
//       { id: "open-layers", label: "Layers", command: "open-layers", togglable: true },
//       { id: "open-style", label: "Styles", command: "open-style-manager", togglable: true },
//       { id: "open-traits", label: "Traits", command: "open-traits", togglable: true },
//     ]);

//     editorInstanceRef.current = editor;
    
//     setIsReady(true);

//     return () => editor.destroy();
//   }, []);



//   // ✅ Load HTML + CSS only when editor is ready and store data is present
//   useEffect(() => {
//     if (!isReady || !store) return;

//     const editor = editorInstanceRef.current;
//     if (!editor) return;

//     const html =
//       store?.websiteHtml && store.websiteHtml.trim() !== ""
//         ? store.websiteHtml
//         : generateWebsiteContent(store, publishedProducts);

//     const css = store?.websiteCss || "";

//     editor.setComponents(html);
//     editor.setStyle(css);
//   }, [isReady, store, publishedProducts]);

//   // ✅ Save to backend
//   const handleSave = async () => {
//     const editor = editorInstanceRef.current;
//     if (!editor || !store?._id) {
//       alert("Editor or store data not ready");
//       return;
//     }

//     const html = editor.getHtml();
//     const css = editor.getCss();

//     try {
//       const res = await fetch(
//         `https://hivehub-1.onrender.com/api/stores/stores/${store._id}/website`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ websiteHtml: html, websiteCss: css }),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to save website");

//       alert("✅ Website saved successfully!");
//     } catch (err) {
//       console.error("Error saving website:", err);
//       alert("❌ Failed to save website");
//     }
//   };
// console.log("🛒 Store data in WebEditor:", store);
//   // ✅ Default website generator
//   const generateWebsiteContent = (store, publishedProducts) => {
//     console.log("Published products:", publishedProducts);
//     return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>${store.name} - Online Store</title>
//     <style>
//     .hero-gradient {
//   background: linear-gradient(180deg, #4f46e5 0%, #3b82f6 100%);
//   min-height: 60vh;
// }

//         .product-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
//         .hero-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
//         .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
//     </style>
// </head>
// <body class="bg-white">
//     <header class="bg-transparent absolute top-0 left-0 w-full z-10">
//         <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div class="flex justify-between items-center h-16">
//                 <div class="flex items-center">
//                     <h1 class="text-2xl font-bold text-gray-900">${store.name}</h1>
//                     <span class="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">${store.category}</span>
//                 </div>
//                 <nav class="flex space-x-8">
//                     <a href="#products" class="text-gray-600 hover:text-gray-900">Products</a>
//                     <div id="cart-indicator" class="relative">
//                         <span class="text-gray-600">🛒</span>
//                         <span id="cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center hidden">0</span>
//                     </div>
//                 </nav>
//             </div>
//         </div>
//     </header>
//     <section class="hero-gradient text-white py-28 relative">
//         <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <h2 class="text-4xl font-bold mb-4">Welcome to ${store.name}</h2>
//             <p class="text-xl mb-8">${store.description || `Your trusted ${store.category} store with amazing products!`}</p>
//             <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Shop Now</a>
//         </div>
//     </section>
//     <section id="products" class="py-16">
//         <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Products</h2>
            
//             ${publishedProducts.length === 0 ? `
//                 <div class="text-center py-12">
//                     <div class="text-6xl mb-4">📦</div>
//                     <h3 class="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
//                     <p class="text-gray-600">We're adding amazing products to our store. Check back soon!</p>
//                 </div>
//             ` : `
//                 <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                     ${publishedProducts.map(product => `
//                         <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
//                             <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" onerror="this.src='https://via.placeholder.com/300x300/4F46E5/white?text=Product'">
//                             <div class="p-6">
//                                 <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${product.name}</h3>
//                                 <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
//                                 <div class="flex items-center justify-between mb-3">
//                                     <div>
//                                       <span class="text-lg font-bold text-gray-900">
//                                         $${Number(product.sellingPrice || product.price || 0).toFixed(2)}
//                                       </span>
//                                       ${product.price
//                                         ? `<span class="ml-2 text-sm text-gray-500 line-through">$${Number(product.price).toFixed(2)}</span>`
//                                         : ''}
//                                     </div>

//                                 </div>
//                                 <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" data-product-name="${product.name}" data-product-price="${Number(product.sellingPrice || product.price).toFixed(2)}">Add to Cart</button>
//                                 <div class="mt-3 flex items-center">
//                                     <div class="flex items-center">
//                                         ${Array(5).fill(0).map((_, i) => `<svg class="w-4 h-4 ${i < Math.floor(product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`).join('')}
//                                     </div>
//                                     <span class="ml-2 text-sm text-gray-600">(${product.reviews || 0})</span>
//                                 </div>
//                                 ${product.isFreeShipping ? '<div class="mt-2"><span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Free Shipping</span></div>' : ''}
//                             </div>
//                         </div>
//                     `).join('')}
//                 </div>
//             `}
//         </div>
//     </section>
//     <script>
//         let cart = [];
//         const cartCountElement = document.getElementById('cart-count');
        
//         function updateCartCount() {
//             const count = cart.length;
//             if (count > 0) {
//                 cartCountElement.textContent = count;
//                 cartCountElement.classList.remove('hidden');
//             } else {
//                 cartCountElement.classList.add('hidden');
//             }
//         }
        
//         document.addEventListener('click', function(e) {
//             if (e.target.classList.contains('add-to-cart-btn')) {
//                 e.preventDefault();
//                 const productName = e.target.dataset.productName;
//                 const productPrice = e.target.dataset.productPrice;
                
//                 cart.push({name: productName, price: productPrice});
                
//                 e.target.textContent = 'Added!';
//                 e.target.classList.remove('bg-blue-600', 'hover:bg-blue-700');
//                 e.target.classList.add('bg-green-600');
                
//                 updateCartCount();
                
//                 setTimeout(() => {
//                     e.target.textContent = 'Add to Cart';
//                     e.target.classList.remove('bg-green-600');
//                     e.target.classList.add('bg-blue-600', 'hover:bg-blue-700');
//                 }, 2000);
                
//                 const toast = document.createElement('div');
//                 toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
//                 toast.textContent = \`Added "\${productName}" to cart!\`;
//                 document.body.appendChild(toast);
                
//                 setTimeout(() => toast.remove(), 3000);
//             }
//         });
//     </script>
        
//     <footer class="bg-gray-900 text-white py-12">
//         <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
//                 <div>
//                     <h3 class="text-lg font-semibold mb-4">${store.name}</h3>
//                     <p class="text-gray-400">Your trusted online ${store.category} store.</p>
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
//                         <p>📧 info@${store.name.toLowerCase().replace(/\s+/g, '')}.com</p>
//                         <p>📞 +1 (555) 123-4567</p>
//                         <p>📍 123 Business St, City, State</p>
//                     </div>
//                 </div>
//             </div>
//             <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//                 <p>&copy; 2024 ${store.name}. All rights reserved. | Powered by DropShip Pro</p>
//             </div>
//         </div>
//     </footer>
// </body>
//             </html>`;
//   };

//   return (
//      <div>
//       <div className="flex justify-end p-2 border-b bg-gray-50">
//         <button
//           onClick={handleSave}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//         >
//           💾 Save Website
//         </button>
//       </div>
//       <div id="gjs" ref={editorContainerRef} />
//     </div>
//   );
// };

// export default WebEditor;









// src/pages/Landing/WebEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import gjsPresetWebpage from "grapesjs-preset-webpage"; // install if you want: npm i grapesjs-preset-webpage

const WebEditor = () => {
  const location = useLocation();
  const { storeId } = useParams();
  // get passed state from navigate() if available
  const { store: navStore, publishedProducts: navProducts } = location.state || {};

  // we'll prefer navigation state, else we'll fetch (fallback)
  const [store, setStore] = useState(navStore || null);
  const [stores, setStores] = useState([]);
  console.log("stores stores", stores)
  const [publishedProducts, setPublishedProducts] = useState(navProducts || []);
  const editorContainerRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const token = localStorage.getItem("token"); // adjust if you store token elsewhere


  // If user reloads /builder/:storeId, fetch store from backend
  useEffect(() => {
    if (!navStore && storeId) {
      (async () => {
        try {
          const res = await fetch(`https://hivehub-1.onrender.com/api/stores/${storeId}`);
          const data = await res.json();
          if (res.ok) {
            setStore(data.store);
            setPublishedProducts(data.store?.publishedProducts || []);
          } else {
            console.error("Failed to fetch store:", data);
          }
        } catch (err) {
          console.error("Fetch store error:", err);
        }
      })();
    }
  }, [navStore, storeId]);

  // Single GrapesJS initialization + localStorage cleanup
  useEffect(() => {
    if (!editorContainerRef.current) return;
    // Cleanup any corrupted saved project keys (fixes the 'elevate""' error)
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("gjs"))
        .forEach((k) => {
          const v = localStorage.getItem(k);
          if (v && (v.includes('elevate""') || v.includes("elevate"))) {
            console.warn("Removing corrupted GrapesJS localStorage key:", k);
            localStorage.removeItem(k);
          }
        });
    } catch (err) {
      console.warn("Error checking gjs localStorage:", err);
    }

    // Initialize GrapesJS once
    if (editorInstanceRef.current) return;

    const editor = grapesjs.init({
      container: editorContainerRef.current,
      height: "100vh",
      width: "auto",
      fromElement: false,
      storageManager: {
        type: "local",
        autosave: true,
        autoload: false, // safer: don't autoload potentially corrupted state
      },
      plugins: [gjsPresetWebpage],
      pluginsOpts: {
        [gjsPresetWebpage]: {},
      },
      // important: load Tailwind inside the editor iframe
      canvas: {
        styles: [
          // If you have a compiled Tailwind CSS hosted, prefer that URL here.
          // We include tailwind via script below too to support dynamic utilities.
        ],
        scripts: [
          "https://cdn.tailwindcss.com", // ensures Tailwind runs inside iframe
        ],
      },
    });

    // Add a lightweight top toolbar for device switching and basic actions
    const pn = editor.Panels;
    // create container before #gjs so toolbar sits above editor
    const topBar = document.createElement("div");
    topBar.className = "gjs-topbar flex justify-between items-center p-2 bg-gray-100 border-b";
    topBar.innerHTML = `
      <div class="panel__devices flex gap-2"></div>
      <div class="panel__options flex gap-2"></div>
      <div class="panel__views flex gap-2"></div>
    `;
    editorContainerRef.current.before(topBar);

    pn.addPanel({ id: "devices-panel", el: ".panel__devices" });
    pn.addPanel({ id: "options-panel", el: ".panel__options" });
    pn.addPanel({ id: "views-panel", el: ".panel__views" });

    pn.getPanel("devices-panel").get("buttons").add([
      { id: "device-desktop", className: "btn-device", label: "Desktop", command: () => editor.setDevice("Desktop"), active: true },
      { id: "device-tablet", className: "btn-device", label: "Tablet", command: () => editor.setDevice("Tablet") },
      { id: "device-mobile", className: "btn-device", label: "Mobile", command: () => editor.setDevice("Mobile") },
    ]);

    pn.getPanel("options-panel").get("buttons").add([
      { id: "undo", label: "Undo", command: "core:undo" },
      { id: "redo", label: "Redo", command: "core:redo" },
      { id: "clear", label: "Clear", command: () => editor.runCommand("core:canvas-clear") },
    ]);

    pn.getPanel("views-panel").get("buttons").add([
      { id: "open-blocks", label: "Blocks", command: "open-blocks", togglable: true },
      { id: "open-layers", label: "Layers", command: "open-layers", togglable: true },
      { id: "open-styles", label: "Styles", command: "open-style-manager", togglable: true },
      { id: "open-traits", label: "Traits", command: "open-traits", togglable: true },
    ]);

    editorInstanceRef.current = editor;
    setIsReady(true);

    // small visual background inside canvas body so sections don't float on white
    editor.on("load", () => {
      try {
        const iframeBody = editor.Canvas.getBody();
        if (iframeBody) iframeBody.style.backgroundColor = "#f8fafc"; // tailwind gray-50 like
      } catch (e) {
        // ignore
      }
    });

    return () => {
      try {
        editor.destroy();
      } catch (e) {}
      editorInstanceRef.current = null;
    };
  }, []);

  // Helper: extract body innerHTML and head styles from saved full HTML (if any)
  const extractBodyAndHeadStyles = (rawHtml) => {
    if (!rawHtml) return { bodyHtml: "", headStyle: "" };
    // If the rawHtml looks like a full document, parse it
    try {
      if (/<html[\s\S]*>/i.test(rawHtml)) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, "text/html");
        const bodyHtml = doc.body ? doc.body.innerHTML : rawHtml;
        // collect style tags from head
        let headStyle = "";
        doc.head && doc.head.querySelectorAll("style").forEach((s) => {
          headStyle += s.innerHTML + "\n";
        });
        return { bodyHtml, headStyle };
      } else {
        // not a full doc, treat as body content only
        return { bodyHtml: rawHtml, headStyle: "" };
      }
    } catch (err) {
      console.warn("HTML parse failed, falling back to raw HTML:", err);
      return { bodyHtml: rawHtml, headStyle: "" };
    }
  };

  // When editor is ready and store data available, load content safely
  useEffect(() => {
    if (!isReady) return;
    if (!editorInstanceRef.current) return;

    const editor = editorInstanceRef.current;

    // prefer the latest store (from state), fallback to navStore
    const currentStore = store || navStore;
    const currentProducts = publishedProducts?.length ? publishedProducts : navProducts || [];

    // Build raw HTML to load: prefer explicit store.websiteHtml; else generate
    const rawHtml = currentStore?.websiteHtml && currentStore.websiteHtml.trim() !== ""
      ? currentStore.websiteHtml
      : generateWebsiteContent(currentStore || { name: "My Store", category: "" }, currentProducts);

    // Extract possible <style> content embedded in saved websiteHtml (if saved as full doc)
    const { bodyHtml, headStyle } = extractBodyAndHeadStyles(rawHtml);

    // The editor may also have CSS stored separately (websiteCss)
    const savedCss = currentStore?.websiteCss || "";

    // Combined CSS that we will set inside the editor
    const combinedCss = (headStyle ? headStyle + "\n" : "") + savedCss;

    try {
      // set components (body markup) and set style (css)
      editor.setComponents(bodyHtml);
      if (combinedCss && combinedCss.trim() !== "") editor.setStyle(combinedCss);
      console.log("✅ Loaded content into editor (components + css).");
    } catch (err) {
      console.error("Error setting editor content:", err);
    }
  }, [isReady, store, publishedProducts, navStore, navProducts]);

  
  // Save handler: saves both full HTML doc & CSS to backend
  const handleSave = async () => {
    const editor = editorInstanceRef.current;
    const currentStore = store || navStore;
    console.log("current store", currentStore);
    if (!editor) return alert("Editor not ready");
    if (!currentStore || !currentStore._id) return alert("Store data not ready");

    const bodyHtml = editor.getHtml(); // returns body markup
    const css = editor.getCss(); // returns css from style manager

    // Compose a full HTML document for serving on frontend/live preview
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${css || ""}</style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

    try {
      const res = await fetch(`https://hivehub-1.onrender.com/api/stores/stores/${currentStore._id}/website`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      body: JSON.stringify({
        websiteHtml: fullHtml,
        websiteCss: css || "",
        publishedProducts: currentStore.publishedProducts || [],
      })
    });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      alert("✅ Saved website successfully");

      // also update local store state with new html/css so re-entering editor shows latest
      // setStore((s) => ({ ...(s || {}), websiteHtml: fullHtml, websiteCss: css || "" }));
        setStore((prev) => ({ ...(prev || {}), ...data.store }));
          setStores(prev => prev.map(s => (s._id === data.store._id ? { ...data.store, localUrl: undefined } : s)));

        localStorage.setItem(`store_${data.store._id}`, JSON.stringify(data.store));

      return data.store
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to save website");
    }
  };

  // fallback simple generator — returns full HTML doc if no store.websiteHtml exists
  const generateWebsiteContent = (storeObj, products = []) => {
    console.log("publish product hai re", publishedProducts)
    console.log("pro", products);
    const name = (storeObj && storeObj.name) || "My Store";
    const category = (storeObj && storeObj.category) || "";
    const description = (storeObj && storeObj.description) || `Your trusted ${category} store with amazing products!`;
    // Keep this full HTML document minimal — CSS goes into editor.setStyle or saved CSS.
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .hero-gradient { background: linear-gradient(180deg,#4f46e5 0%,#3b82f6 100%); min-height:60vh; }
    .product-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
  </style>
</head>
<body>
  <header class="bg-transparent absolute top-0 left-0 w-full z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div><h1 class="text-2xl font-bold">${name}</h1></div>
        <nav class="flex space-x-4"><a href="#products">Products</a></nav>
      </div>
    </div>
  </header>

  <section class="hero-gradient text-white py-28 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-4xl font-bold mb-4">Welcome to ${name}</h2>
      <p class="text-xl mb-8">${description}</p>
      <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">Shop Now</a>
    </div>
  </section>

  <section id="products" class="py-16">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Our Products</h2>
      ${publishedProducts && publishedProducts.length
        ? `<div class="grid grid-cols-1 md:grid-cols-3 gap-8">${publishedProducts.map(p => `<div class="product-card p-4 bg-white rounded shadow"><img src="${p.image}" class="w-full h-48 object-cover"/><h3 class="mt-2">${p.name}</h3><p class="text-gray-600">$${Number(p.sellingPrice||p.price||0).toFixed(2)}</p></div>`).join("")}</div>`
        : `<div class="text-center text-gray-600">No products yet</div>`
      }
    </div>
  </section>
  <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4">${store.name}</h3>
                    <p class="text-gray-400">Your trusted online ${store.name   } store.</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#products" class="hover:text-white">Products</a></li>
                        <li><a href="#about" class="hover:text-white">About Us</a></li>
                        <li><a href="#contact" class="hover:text-white">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Support</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">Help Center</a></li>
                        <li><a href="#" class="hover:text-white">Returns</a></li>
                        <li><a href="#" class="hover:text-white">Shipping Info</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Contact Info</h4>
                    <div class="text-gray-400 space-y-2">
                        <p>📧 info@${store.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                        <p>📞 +1 (555) 123-4567</p>
                        <p>📍 123 Business St, City, State</p>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 ${store.name}. All rights reserved. | Powered by DropShip Pro</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-end p-2 border-b bg-gray-50">
        <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
          💾 Save Website
        </button>
      </div>
      <div id="gjs" ref={editorContainerRef} style={{ minHeight: "80vh" }} />
    </div>
  );
};

export default WebEditor;
