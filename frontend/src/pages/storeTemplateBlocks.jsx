// export const getStoreBlocks = (store, publishedProducts) => {
//   console.log("Store Data:7777777777777777777777777777", store);


//   // HEADER SECTION
// const headerSection = `
//   <header class="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 shadow-md" data-gjs-type="header-block">
//     <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
//       <h1 class="text-2xl font-bold">${store.name}</h1>
//       <nav class="flex items-center space-x-6">
//         <a href="#products" class="hover:text-gray-200">Products</a>
//         <button id="loginBtn" class="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">Login</button>
//         <button id="registerBtn" class="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition">Register</button>
//       </nav>
//     </div>
//   </header>
// `;


//   // HERO SECTION
//   const heroSection = `
//     <section class="hero-gradient text-white py-20" data-gjs-type="hero-block">
//       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h2 class="text-4xl font-bold mb-4">Welcome to ${store?.name}</h2>
//         <p class="text-xl mb-8">${`Your trusted ${store?.name} store with amazing products!`}</p>
//         <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Shop Now</a>
//       </div>
//     </section>
//   `;

//   console.log("Published Products:888888888888888888888888888", publishedProducts);

//   // PRODUCTS SECTION
//   const productsGrid =
//     publishedProducts.length === 0
//       ? `
//         <section id="products" class="py-16 text-center">
//           <div class="text-6xl mb-4">📦</div>
//           <h3 class="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
//           <p class="text-gray-600">We're adding amazing products to our store. Check back soon!</p>
//         </section>`
//       : `
//         <section id="products" class="py-16" data-gjs-type="product-grid">
//           <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Products</h2>
//             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               ${publishedProducts
//                 .map(
//                   (product) => `
//                 <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
//                   <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" />
//                   <div class="p-6">
//                     <h3 class="font-semibold text-gray-900 mb-2">${product.name}</h3>
//                     <p class="text-gray-600 text-sm mb-3">${product.category}</p>
//                     <div class="flex items-center justify-between mb-3">
//                       <div>
//                         <span class="text-lg font-bold text-gray-900">$₹${Number(product.sellingPrice || product.price || 0).toFixed(2)}</span>
//                       </div>
//                     </div>
//                     <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Add to Cart</button>
//                   </div>
//                 </div>`
//                 )
//                 .join("")}
//             </div>
//           </div>
//         </section>
//       `;

//   const authModal = `   
//   <div id="authModal" class="hidden fixed inset-0 modal-bg flex items-center justify-center z-50">
//     <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
//       <h2 id="modalTitle" class="text-2xl font-bold mb-4 text-center"></h2>
//       <form id="authForm" class="space-y-4">
//         <input type="text" id="username" placeholder="Username" class="w-full border p-2 rounded" required />
//         <input type="password" id="password" placeholder="Password" class="w-full border p-2 rounded" required />
//         <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-semibold"></button>
//       </form>
//       <button id="closeModal" class="mt-4 text-gray-500 hover:text-gray-800 w-full text-center">Close</button>
//     </div>
//   </div>`;

//   // FOOTER SECTION
//   const footerSection = `
//     <footer class="bg-gray-900 text-white py-12" data-gjs-type="footer-block">
//       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
//         <div>
//           <h3 class="text-lg font-semibold mb-4">${store.name}</h3>
//           <p class="text-gray-400">Your trusted online ${store.name} store.</p>
//         </div>
//         <div>
//           <h4 class="font-semibold mb-4">Quick Links</h4>
//           <ul class="space-y-2 text-gray-400">
//             <li><a href="#products" class="hover:text-white">Products</a></li>
//             <li><a href="#about" class="hover:text-white">About Us</a></li>
//             <li><a href="#contact" class="hover:text-white">Contact</a></li>
//           </ul>
//         </div>
//         <div>
//           <h4 class="font-semibold mb-4">Support</h4>
//           <ul class="space-y-2 text-gray-400">
//             <li><a href="#" class="hover:text-white">Help Center</a></li>
//             <li><a href="#" class="hover:text-white">Returns</a></li>
//             <li><a href="#" class="hover:text-white">Shipping Info</a></li>
//           </ul>
//         </div>
//         <div>
//           <h4 class="font-semibold mb-4">Contact Info</h4>
//           <div class="text-gray-400 space-y-2">
//             <p>📧 info@${store.name.toLowerCase().replace(/\s+/g, "")}.com</p>
//             <p>📞 +1 (555) 123-4567</p>
//             <p>📍 123 Business St, City, State</p>
//           </div>
//         </div>
//       </div>
//     </footer>`;

//   // AUTH MODAL SCRIPT
//   const authModalScript = `
//     <script>
//     const modal = document.getElementById("authModal");
//     const modalTitle = document.getElementById("modalTitle");
//     const authForm = document.getElementById("authForm");
//     const submitBtn = authForm.querySelector("button");
//     const loginBtn = document.getElementById("loginBtn");
//     const registerBtn = document.getElementById("registerBtn");
//     const closeModal = document.getElementById("closeModal");

//     let currentMode = "login";

//     const API_BASE = "http://localhost:8000/api/store-users"; // 🔁 Replace with your backend domain

//     function openModal(mode) {
//       currentMode = mode;
//       modalTitle.textContent = mode === "login" ? "Login" : "Register";
//       submitBtn.textContent = mode === "login" ? "Login" : "Register";
//       modal.classList.remove("hidden");
//     }

//     function closeModalFn() {
//       modal.classList.add("hidden");
//     }

//     loginBtn.addEventListener("click", () => openModal("login"));
//     registerBtn.addEventListener("click", () => openModal("register"));
//     closeModal.addEventListener("click", closeModalFn);

//     authForm.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const username = document.getElementById("username").value;
//       const password = document.getElementById("password").value;
//       try {
//         const res = await fetch(\`\${API_BASE}/\${currentMode}\`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username, password })
//         });
//         const data = await res.json();
//         if (res.ok) {
//           localStorage.setItem("storeUser", JSON.stringify(data.user));
//           alert(\`\${currentMode} successful! Welcome, \${data.user.username}\`);
//           closeModalFn();
//         } else {
//           alert(data.message || "Something went wrong");
//         }
//       } catch (err) {
//         alert("Network error: " + err.message);
//       }
//     });
//   </script>
//     `;

//   return { heroSection, productsGrid, footerSection, authModalScript, authModal, headerSection };
// };



// export const getStoreBlocks = (store, publishedProducts) => {
//   console.log("Store Data:", store);

//   // HEADER SECTION
//   const headerSection = `
//   <header class="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 shadow-md" data-gjs-type="header-block">
//     <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
//       <h1 class="text-2xl font-bold">${store.name}</h1>
//       <nav class="flex items-center space-x-6">
//         <a href="#products" class="hover:text-gray-200">Products</a>
//         <button id="loginBtn" class="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">Login</button>
//         <button id="registerBtn" class="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition">Register</button>
//       </nav>
//     </div>
//   </header>
//   `;

//   // HERO SECTION
//   const heroSection = `
//     <section class="hero-gradient text-white py-20" data-gjs-type="hero-block">
//       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h2 class="text-4xl font-bold mb-4">Welcome to ${store?.name}</h2>
//         <p class="text-xl mb-8">${`Your trusted ${store?.name} store with amazing products!`}</p>
//         <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Shop Now</a>
//       </div>
//     </section>
//   `;

//   // PRODUCTS SECTION
//   const productsGrid =
//     publishedProducts.length === 0
//       ? `
//         <section id="products" class="py-16 text-center">
//           <div class="text-6xl mb-4">📦</div>
//           <h3 class="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
//           <p class="text-gray-600">We're adding amazing products to our store. Check back soon!</p>
//         </section>`
//       : `
//         <section id="products" class="py-16" data-gjs-type="product-grid">
//           <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Products</h2>
//             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               ${publishedProducts
//                 .map(
//                   (product) => `
//                 <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
//                   <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" />
//                   <div class="p-6">
//                     <h3 class="font-semibold text-gray-900 mb-2">${product.name}</h3>
//                     <p class="text-gray-600 text-sm mb-3">${product.category}</p>
//                     <div class="flex items-center justify-between mb-3">
//                       <div>
//                         <span class="text-lg font-bold text-gray-900">₹${Number(product.sellingPrice || product.price || 0).toFixed(2)}</span>
//                       </div>
//                     </div>
//                     <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Add to Cart</button>
//                   </div>
//                 </div>`
//                 )
//                 .join("")}
//             </div>
//           </div>
//         </section>
//       `;

//   // AUTH MODAL (Login/Register)
//   const authModal = `
//   <div id="authModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
//       <h2 id="modalTitle" class="text-2xl font-bold mb-4 text-center"></h2>
//       <form id="authForm" class="space-y-4">
//         <input type="text" id="nameField" placeholder="Full Name" class="w-full border p-2 rounded hidden" />
//         <input type="email" id="emailField" placeholder="Email" class="w-full border p-2 rounded" required />
//         <input type="password" id="passwordField" placeholder="Password" class="w-full border p-2 rounded" required />
//         <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-semibold"></button>
//       </form>
//       <button id="closeModal" class="mt-4 text-gray-500 hover:text-gray-800 w-full text-center">Close</button>
//     </div>
//   </div>
//   `;

//   // FOOTER
//   const footerSection = `
//     <footer class="bg-gray-900 text-white py-12" data-gjs-type="footer-block">
//       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <p class="text-gray-400">&copy; 2025 ${store.name}. All rights reserved. | Powered by Hive Hub</p>
//       </div>
//     </footer>`;

//   // AUTH + CART SCRIPT
//   const authModalScript = `
//     <script>
//       const storeId = "${store._id}";
//       const API_BASE = "http://localhost:8000/api/store-users";

//       const modal = document.getElementById("authModal");
//       const modalTitle = document.getElementById("modalTitle");
//       const authForm = document.getElementById("authForm");
//       const submitBtn = authForm.querySelector("button");
//       const nameField = document.getElementById("nameField");
//       const emailField = document.getElementById("emailField");
//       const passwordField = document.getElementById("passwordField");
//       const loginBtn = document.getElementById("loginBtn");
//       const registerBtn = document.getElementById("registerBtn");
//       const closeModal = document.getElementById("closeModal");

//       let currentMode = "login";

//       function openModal(mode) {
//         currentMode = mode;
//         modalTitle.textContent = mode === "login" ? "Login" : "Register";
//         submitBtn.textContent = mode === "login" ? "Login" : "Register";
//         nameField.classList.toggle("hidden", mode !== "register");
//         modal.classList.remove("hidden");
//       }

//       function closeModalFn() {
//         modal.classList.add("hidden");
//       }

//       loginBtn.addEventListener("click", () => openModal("login"));
//       registerBtn.addEventListener("click", () => openModal("register"));
//       closeModal.addEventListener("click", closeModalFn);

//       // Already logged-in state
//       const storeUser = JSON.parse(localStorage.getItem("storeUser"));
//       if (storeUser) {
//         loginBtn.textContent = "Logout (" + storeUser.name + ")";
//         registerBtn.style.display = "none";
//         loginBtn.onclick = () => {
//           localStorage.removeItem("storeUser");
//           localStorage.removeItem("storeToken");
//           alert("Logged out successfully!");
//           window.location.reload();
//         };
//       }

//       // Form submit
//       authForm.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const name = nameField.value;
//         const email = emailField.value;
//         const password = passwordField.value;
//         const body = currentMode === "login" ? { email, password, storeId } : { name, email, password, storeId };

//         try {
//           const res = await fetch(\`\${API_BASE}/\${currentMode}\`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(body)
//           });
//           const data = await res.json();
//           if (res.ok) {
//             localStorage.setItem("storeUser", JSON.stringify(data.user));
//             localStorage.setItem("storeToken", data.token);
//             alert(\`\${currentMode} successful! Welcome, \${data.user.name}\`);
//             closeModalFn();
//             window.location.reload();
//           } else {
//             alert(data.message || "Something went wrong");
//           }
//         } catch (err) {
//           alert("Network error: " + err.message);
//         }
//       });

//       // 🛒 ADD TO CART
//       document.addEventListener("click", function(e) {
//         if (e.target.classList.contains("add-to-cart-btn")) {
//           e.preventDefault();
//           const card = e.target.closest(".product-card");
//           const name = card.querySelector("h3").textContent;
//           const price = card.querySelector(".text-gray-600").textContent;

//           let cart = JSON.parse(localStorage.getItem("cart")) || [];
//           cart.push({ name, price });
//           localStorage.setItem("cart", JSON.stringify(cart));

//           e.target.textContent = "Added!";
//           e.target.classList.remove("bg-blue-600");
//           e.target.classList.add("bg-green-600");

//           setTimeout(() => {
//             e.target.textContent = "Add to Cart";
//             e.target.classList.remove("bg-green-600");
//             e.target.classList.add("bg-blue-600");
//           }, 1500);
//         }
//       });
//     </script>
//   `;

//   return {
//     headerSection,
//     heroSection,
//     productsGrid,
//     footerSection,
//     authModal,
//     authModalScript,
//   };
// };









// export const getStoreBlocks = (store, publishedProducts) => {
//   // HEADER SECTION
//   const headerSection = `
//   <header class="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 shadow-md" data-gjs-type="header-block">
//     <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
//       <h1 class="text-2xl font-bold">${store.name}</h1>
//       <nav class="flex items-center space-x-6">
//         <a href="#products" class="hover:text-gray-200">Products</a>
//         <button id="loginBtn" class="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">Login</button>
//         <button id="registerBtn" class="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition">Register</button>
//         <div id="cartIcon" class="relative cursor-pointer">
//           🛒
//           <span id="cartCount" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center hidden">0</span>
//         </div>
//       </nav>
//     </div>
//   </header>
//   `;

//   // HERO SECTION
//   const heroSection = `
//     <section class="hero-gradient text-white py-20" data-gjs-type="hero-block">
//       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h2 class="text-4xl font-bold mb-4">Welcome to ${store?.name}</h2>
//         <p class="text-xl mb-8">${`Your trusted ${store?.name} store with amazing products!`}</p>
//         <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Shop Now</a>
//       </div>
//     </section>
//   `;

//   // PRODUCTS SECTION
//   const productsGrid =
//     publishedProducts.length === 0
//       ? `
//         <section id="products" class="py-16 text-center">
//           <div class="text-6xl mb-4">📦</div>
//           <h3 class="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
//           <p class="text-gray-600">We're adding amazing products to our store. Check back soon!</p>
//         </section>`
//       : `
//         <section id="products" class="py-16" data-gjs-type="product-grid">
//           <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Products</h2>
//             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               ${publishedProducts
//                 .map(
//                   (product) => `
//                 <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
//                   <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" />
//                   <div class="p-6">
//                     <h3 class="font-semibold text-gray-900 mb-2">${product.name}</h3>
//                     <p class="text-gray-600 text-sm mb-3">${product.category}</p>
//                     <div class="flex items-center justify-between mb-3">
//                       <div>
//                         <span class="text-lg font-bold text-gray-900">₹${Number(product.sellingPrice || product.price || 0).toFixed(2)}</span>
//                       </div>
//                     </div>
//                     <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700" data-name="${product.name}" data-price="${product.sellingPrice || product.price}">Add to Cart</button>
//                   </div>
//                 </div>`
//                 )
//                 .join("")}
//             </div>
//           </div>
//         </section>
//       `;

//   // AUTH MODAL
//   const authModal = `
//   <div id="authModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
//       <h2 id="modalTitle" class="text-2xl font-bold mb-4 text-center"></h2>
//       <form id="authForm" class="space-y-4">
//         <input type="text" id="nameField" placeholder="Full Name" class="w-full border p-2 rounded hidden" />
//         <input type="email" id="emailField" placeholder="Email" class="w-full border p-2 rounded" required />
//         <input type="password" id="passwordField" placeholder="Password" class="w-full border p-2 rounded" required />
//         <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-semibold"></button>
//       </form>
//       <button id="closeModal" class="mt-4 text-gray-500 hover:text-gray-800 w-full text-center">Close</button>
//     </div>
//   </div>`;

//   // 🛍 CART MODAL
//   const cartModal = `
//   <div id="cartModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
//       <h2 class="text-2xl font-bold mb-4 text-center">Your Cart</h2>
//       <div id="cartItems" class="space-y-4 max-h-80 overflow-y-auto"></div>
//       <div class="mt-4 text-center font-semibold text-lg">Total: ₹<span id="cartTotal">0.00</span></div>
//       <button id="checkoutBtn" class="w-full mt-4 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700">Proceed to Checkout</button>
//       <button id="closeCart" class="mt-3 w-full text-gray-500 hover:text-gray-800">Close</button>
//     </div>
//   </div>`;

//   // FOOTER
//   const footerSection = `
//     <footer class="bg-gray-900 text-white py-12" data-gjs-type="footer-block">
//       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <p class="text-gray-400">&copy; 2025 ${store.name}. All rights reserved. | Powered by Hive Hub</p>
//       </div>
//     </footer>`;

//   // SCRIPT SECTION
//   const scriptSection = `
//   <script>
//     const storeId = "${store._id}";
//     const API_BASE = "http://localhost:8000/api/store-users";
//     const WHOP_CHECKOUT_API = "http://localhost:8000/api/payments/create-whop-session"; // ✅ your existing backend

//     // ========== AUTH LOGIC ==========
//     const modal = document.getElementById("authModal");
//     const modalTitle = document.getElementById("modalTitle");
//     const authForm = document.getElementById("authForm");
//     const submitBtn = authForm.querySelector("button");
//     const nameField = document.getElementById("nameField");
//     const emailField = document.getElementById("emailField");
//     const passwordField = document.getElementById("passwordField");
//     const loginBtn = document.getElementById("loginBtn");
//     const registerBtn = document.getElementById("registerBtn");
//     const closeModal = document.getElementById("closeModal");

//     let currentMode = "login";

//     function openModal(mode) {
//       currentMode = mode;
//       modalTitle.textContent = mode === "login" ? "Login" : "Register";
//       submitBtn.textContent = mode === "login" ? "Login" : "Register";
//       nameField.classList.toggle("hidden", mode !== "register");
//       modal.classList.remove("hidden");
//     }

//     function closeModalFn() {
//       modal.classList.add("hidden");
//     }

//     loginBtn.addEventListener("click", () => openModal("login"));
//     registerBtn.addEventListener("click", () => openModal("register"));
//     closeModal.addEventListener("click", closeModalFn);

//     // Already logged-in state
//     const storeUser = JSON.parse(localStorage.getItem("storeUser"));
//     if (storeUser) {
//       loginBtn.textContent = "Logout (" + storeUser.name + ")";
//       registerBtn.style.display = "none";
//       loginBtn.onclick = () => {
//         localStorage.removeItem("storeUser");
//         localStorage.removeItem("storeToken");
//         alert("Logged out successfully!");
//         window.location.reload();
//       };
//     }

//     authForm.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const name = nameField.value;
//       const email = emailField.value;
//       const password = passwordField.value;
//       const body = currentMode === "login" ? { email, password, storeId } : { name, email, password, storeId };

//       try {
//         const res = await fetch(\`\${API_BASE}/\${currentMode}\`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body)
//         });
//         const data = await res.json();
//         if (res.ok) {
//           localStorage.setItem("storeUser", JSON.stringify(data.user));
//           localStorage.setItem("storeToken", data.token);
//           alert(\`\${currentMode} successful! Welcome, \${data.user.name}\`);
//           closeModalFn();
//           window.location.reload();
//         } else {
//           alert(data.message || "Something went wrong");
//         }
//       } catch (err) {
//         alert("Network error: " + err.message);
//       }
//     });

//     // ========== CART LOGIC ==========
//     const cartIcon = document.getElementById("cartIcon");
//     const cartCount = document.getElementById("cartCount");
//     const cartModal = document.getElementById("cartModal");
//     const closeCart = document.getElementById("closeCart");
//     const cartItemsDiv = document.getElementById("cartItems");
//     const cartTotal = document.getElementById("cartTotal");
//     const checkoutBtn = document.getElementById("checkoutBtn");

//     function updateCartCount() {
//       const cart = JSON.parse(localStorage.getItem("cart")) || [];
//       if (cart.length > 0) {
//         cartCount.textContent = cart.length;
//         cartCount.classList.remove("hidden");
//       } else {
//         cartCount.classList.add("hidden");
//       }
//     }

//     updateCartCount();

//     document.addEventListener("click", function(e) {
//       if (e.target.classList.contains("add-to-cart-btn")) {
//         const name = e.target.dataset.name;
//         const price = parseFloat(e.target.dataset.price || 0);
//         let cart = JSON.parse(localStorage.getItem("cart")) || [];
//         cart.push({ name, price });
//         localStorage.setItem("cart", JSON.stringify(cart));
//         updateCartCount();
//         e.target.textContent = "Added!";
//         e.target.classList.remove("bg-blue-600");
//         e.target.classList.add("bg-green-600");
//         setTimeout(() => {
//           e.target.textContent = "Add to Cart";
//           e.target.classList.remove("bg-green-600");
//           e.target.classList.add("bg-blue-600");
//         }, 1000);
//       }
//     });

//     cartIcon.addEventListener("click", () => {
//       const cart = JSON.parse(localStorage.getItem("cart")) || [];
//       cartItemsDiv.innerHTML = cart.map(item => 
//         \`<div class="flex justify-between border-b pb-2">
//           <span>\${item.name}</span><span>₹\${item.price.toFixed(2)}</span>
//         </div>\`
//       ).join("");
//       const total = cart.reduce((sum, i) => sum + Number(i.price), 0);
//       cartTotal.textContent = total.toFixed(2);
//       cartModal.classList.remove("hidden");
//     });

//     closeCart.addEventListener("click", () => cartModal.classList.add("hidden"));

//     checkoutBtn.addEventListener("click", async () => {
//       const cart = JSON.parse(localStorage.getItem("cart")) || [];
//       if (cart.length === 0) return alert("Your cart is empty!");
//       try {
//         const res = await fetch(WHOP_CHECKOUT_API, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ storeId, cart })
//         });
//         const data = await res.json();
//         if (res.ok && data.checkoutUrl) {
//           window.location.href = data.checkoutUrl; // redirect to Whop checkout
//         } else {
//           alert(data.message || "Unable to start checkout");
//         }
//       } catch (err) {
//         alert("Error during checkout: " + err.message);
//       }
//     });
//   </script>
//   `;

//   return {
//     headerSection,
//     heroSection,
//     productsGrid,
//     footerSection,
//     authModal,
//     cartModal,
//     scriptSection,
//   };
// };












// export const getStoreBlocks = (store, publishedProducts) => {
//   const headerSection = `
//   <header class="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 shadow-md" data-gjs-type="header-block">
//     <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
//       <h1 class="text-2xl font-bold">${store.name}</h1>
//       <nav class="flex items-center space-x-6">
//         <a href="#products" class="hover:text-gray-200">Products</a>
//         <button id="loginBtn" class="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">Login</button>
//         <button id="registerBtn" class="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition">Register</button>
//         <div id="cartIcon" class="relative cursor-pointer">
//           🛒
//           <span id="cartCount" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center hidden">0</span>
//         </div>
//       </nav>
//     </div>
//   </header>
//   `;

//   const heroSection = `
//     <section class="hero-gradient text-white py-20" data-gjs-type="hero-block">
//       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h2 class="text-4xl font-bold mb-4">Welcome to ${store?.name}</h2>
//         <p class="text-xl mb-8">${`Your trusted ${store?.name} store with amazing products!`}</p>
//         <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Shop Now</a>
//       </div>
//     </section>
//   `;

//   const productsGrid =
//     publishedProducts.length === 0
//       ? `
//         <section id="products" class="py-16 text-center">
//           <div class="text-6xl mb-4">📦</div>
//           <h3 class="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
//           <p class="text-gray-600">We're adding amazing products to our store. Check back soon!</p>
//         </section>`
//       : `
//         <section id="products" class="py-16" data-gjs-type="product-grid">
//           <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Products</h2>
//             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               ${publishedProducts
//                 .map(
//                   (product) => `
//                 <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
//                   <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" />
//                   <div class="p-6">
//                     <h3 class="font-semibold text-gray-900 mb-2">${product.name}</h3>
//                     <p class="text-gray-600 text-sm mb-3">${product.category}</p>
//                     <div class="flex items-center justify-between mb-3">
//                       <div>
//                         <span class="text-lg font-bold text-gray-900">₹${Number(product.sellingPrice || product.price || 0).toFixed(2)}</span>
//                       </div>
//                     </div>
//                     <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700" data-name="${product.name}" data-price="${product.sellingPrice || product.price}">Add to Cart</button>
//                   </div>
//                 </div>`
//                 )
//                 .join("")}
//             </div>
//           </div>
//         </section>
//       `;

//   const authModal = `
//   <div id="authModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
//       <h2 id="modalTitle" class="text-2xl font-bold mb-4 text-center"></h2>
//       <form id="authForm" class="space-y-4">
//         <input type="text" id="nameField" placeholder="Full Name" class="w-full border p-2 rounded hidden" />
//         <input type="email" id="emailField" placeholder="Email" class="w-full border p-2 rounded" required />
//         <input type="password" id="passwordField" placeholder="Password" class="w-full border p-2 rounded" required />
//         <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-semibold"></button>
//       </form>
//       <button id="closeModal" class="mt-4 text-gray-500 hover:text-gray-800 w-full text-center">Close</button>
//     </div>
//   </div>`;

//   const cartModal = `
//   <div id="cartModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
//       <h2 class="text-2xl font-bold mb-4 text-center">Your Cart</h2>
//       <div id="cartItems" class="space-y-4 max-h-80 overflow-y-auto"></div>
//       <div class="mt-4 text-center font-semibold text-lg">Total: ₹<span id="cartTotal">0.00</span></div>
//       <button id="checkoutBtn" class="w-full mt-4 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700">Proceed to Checkout</button>
//       <button id="closeCart" class="mt-3 w-full text-gray-500 hover:text-gray-800">Close</button>
//     </div>
//   </div>`;

//   const footerSection = `
//     <footer class="bg-gray-900 text-white py-12" data-gjs-type="footer-block">
//       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <p class="text-gray-400">&copy; 2025 ${store.name}. All rights reserved. | Powered by Hive Hub</p>
//       </div>
//     </footer>`;

//   const scriptSection = `
//   <script>
//     const storeId = "${store._id}";
//     const API_BASE = "http://localhost:8000/api/store-users";
//     const WHOP_CHECKOUT_API = "http://localhost:8000/api/whop/checkout";

//     // === AUTH LOGIC ===
//     const modal = document.getElementById("authModal");
//     const modalTitle = document.getElementById("modalTitle");
//     const authForm = document.getElementById("authForm");
//     const submitBtn = authForm.querySelector("button");
//     const nameField = document.getElementById("nameField");
//     const emailField = document.getElementById("emailField");
//     const passwordField = document.getElementById("passwordField");
//     const loginBtn = document.getElementById("loginBtn");
//     const registerBtn = document.getElementById("registerBtn");
//     const closeModal = document.getElementById("closeModal");

//     let currentMode = "login";

//     function openModal(mode) {
//       currentMode = mode;
//       modalTitle.textContent = mode === "login" ? "Login" : "Register";
//       submitBtn.textContent = mode === "login" ? "Login" : "Register";
//       nameField.classList.toggle("hidden", mode !== "register");
//       modal.classList.remove("hidden");
//     }

//     function closeModalFn() {
//       modal.classList.add("hidden");
//     }

//     loginBtn.addEventListener("click", () => openModal("login"));
//     registerBtn.addEventListener("click", () => openModal("register"));
//     closeModal.addEventListener("click", closeModalFn);

//     const storeUser = JSON.parse(localStorage.getItem("storeUser"));
//     if (storeUser) {
//       loginBtn.textContent = "Logout (" + storeUser.name + ")";
//       registerBtn.style.display = "none";
//       loginBtn.onclick = () => {
//         localStorage.removeItem("storeUser");
//         localStorage.removeItem("storeToken");
//         alert("Logged out successfully!");
//         window.location.reload();
//       };
//     }

//     authForm.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const name = nameField.value;
//       const email = emailField.value;
//       const password = passwordField.value;
//       const body = currentMode === "login" ? { email, password, storeId } : { name, email, password, storeId };

//       try {
//         const res = await fetch(\`\${API_BASE}/\${currentMode}\`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body)
//         });
//         const data = await res.json();
//         if (res.ok) {
//           localStorage.setItem("storeUser", JSON.stringify(data.user));
//           localStorage.setItem("storeToken", data.token);
//           alert(\`\${currentMode} successful! Welcome, \${data.user.name}\`);
//           closeModalFn();
//           window.location.reload();
//         } else {
//           alert(data.message || "Something went wrong");
//         }
//       } catch (err) {
//         alert("Network error: " + err.message);
//       }
//     });

//     // === CART LOGIC ===
//     const cartIcon = document.getElementById("cartIcon");
//     const cartCount = document.getElementById("cartCount");
//     const cartModal = document.getElementById("cartModal");
//     const closeCart = document.getElementById("closeCart");
//     const cartItemsDiv = document.getElementById("cartItems");
//     const cartTotal = document.getElementById("cartTotal");
//     const checkoutBtn = document.getElementById("checkoutBtn");

//     function updateCartCount() {
//       const cart = JSON.parse(localStorage.getItem("cart")) || [];
//       cartCount.textContent = cart.length;
//       cartCount.classList.toggle("hidden", cart.length === 0);
//     }

//     updateCartCount();

//     document.addEventListener("click", (e) => {
//       if (e.target.classList.contains("add-to-cart-btn")) {
//         const name = e.target.dataset.name;
//         const price = parseFloat(e.target.dataset.price || 0);
//         let cart = JSON.parse(localStorage.getItem("cart")) || [];
//         cart.push({ name, price });
//         localStorage.setItem("cart", JSON.stringify(cart));
//         updateCartCount();
//         e.target.textContent = "Added!";
//         e.target.classList.replace("bg-blue-600", "bg-green-600");
//         setTimeout(() => {
//           e.target.textContent = "Add to Cart";
//           e.target.classList.replace("bg-green-600", "bg-blue-600");
//         }, 1000);
//       }
//     });

//     cartIcon.addEventListener("click", () => {
//       const cart = JSON.parse(localStorage.getItem("cart")) || [];
//       cartItemsDiv.innerHTML = cart.length
//         ? cart.map(item => \`<div class="flex justify-between border-b pb-2"><span>\${item.name}</span><span>₹\${item.price}</span></div>\`).join("")
//         : "<p class='text-center text-gray-500'>Your cart is empty.</p>";
//       const total = cart.reduce((sum, i) => sum + Number(i.price), 0);
//       cartTotal.textContent = total.toFixed(2);
//       cartModal.classList.remove("hidden");
//     });

//     closeCart.addEventListener("click", () => cartModal.classList.add("hidden"));

   

//     checkoutBtn.addEventListener("click", async () => {
//   const cart = JSON.parse(localStorage.getItem("cart")) || [];
//   if (!cart.length) return alert("Your cart is empty!");

//   try {
//     // 1) Create a pending order in your backend
//     // If the visitor is logged in as storeUser, include userId and token
//     const storeUser = JSON.parse(localStorage.getItem("storeUser"));
//     const token = localStorage.getItem("storeToken");

//     const orderBody = {
//       storeId,
//       userId: storeUser?.id || null, // can be null for guest orders
//       items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity || 1 })),
//       status: "pending"
//     };

//     const orderRes = await fetch("/api/orders/create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {})
//       },
//       body: JSON.stringify(orderBody),
//     });

//     const orderData = await orderRes.json();
//     if (!orderRes.ok) {
//       return alert(orderData.message || "Failed to create order");
//     }

//     // orderData.order should contain order._id or order.orderId (depends on your controller)
//     const createdOrder = orderData.order;
//     const orderId = createdOrder._id || createdOrder.orderId || null;

//     // 2) Create Whop session through your backend; include orderId and cart
//     // Provide a redirect URL where Whop will send user after payment (include orderId)
//     // Replace FRONTEND_BASE with your frontend store success page
//     const redirectUrl = `${window.location.origin}/store/${storeId}/checkout-success?orderId=${orderId}`;

//     // pick planId according to your logic (cart/plan mapping)
//     const planId = "plan_2nmlTo9tmKpBF"; // example — adapt as needed

//     const whopRes = await fetch("/api/whop/checkout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         planId,
//         cart,
//         storeId,
//         orderId,
//         redirectUrl
//       }),
//     });

//     const whopData = await whopRes.json();
//     if (!whopRes.ok) {
//       return alert(whopData.message || "Failed to start checkout");
//     }

//     const purchaseUrl = whopData.purchaseUrl || whopData.checkoutUrl || whopData.url;
//     if (!purchaseUrl) return alert("Checkout URL missing from server response");

//     // 3) Redirect to Whop checkout
//     window.location.href = purchaseUrl;
//   } catch (err) {
//     console.error("Checkout error:", err);
//     alert("Error starting checkout: " + err.message);
//   }
// });

//   </script>
//   `;

//   return {
//     headerSection,
//     heroSection,
//     productsGrid,
//     authModal,
//     cartModal,
//     footerSection,
//     scriptSection,
//   };
// };



















export const getStoreBlocks = (store, publishedProducts) => {
  const headerSection = `
  <header class="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 shadow-md" data-gjs-type="header-block">
    <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">${store.name}</h1>
      <nav class="flex items-center space-x-6">
        <a href="#products" class="hover:text-gray-200">Products</a>
        <button id="loginBtn" class="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">Login</button>
        <button id="registerBtn" class="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition">Register</button>
        <div id="cartIcon" class="relative cursor-pointer">
          🛒
          <span id="cartCount" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center hidden">0</span>
        </div>
      </nav>
    </div>
  </header>
  `;

  const heroSection = `
    <section class="hero-gradient text-white py-20" data-gjs-type="hero-block">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold mb-4">Welcome to ${store?.name}</h2>
        <p class="text-xl mb-8">${`Your trusted ${store?.name} store with amazing products!`}</p>
        <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Shop Now</a>
      </div>
    </section>
  `;

  const productsGrid =
    publishedProducts.length === 0
      ? `
        <section id="products" class="py-16 text-center">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
          <p class="text-gray-600">We're adding amazing products to our store. Check back soon!</p>
        </section>`
      : `
        <section id="products" class="py-16" data-gjs-type="product-grid">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Products</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              ${publishedProducts
                .map(
                  (product) => `
                <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
                  <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" />
                  <div class="p-6">
                    <h3 class="font-semibold text-gray-900 mb-2">${product.name}</h3>
                    <p class="text-gray-600 text-sm mb-3">${product.category}</p>
                    <div class="flex items-center justify-between mb-3">
                      <div>
                        <span class="text-lg font-bold text-gray-900">₹${Number(product.sellingPrice || product.price || 0).toFixed(2)}</span>
                      </div>
                    </div>
                    <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700" data-name="${product.name}" data-price="${product.sellingPrice || product.price}">Add to Cart</button>
                  </div>
                </div>`
                )
                .join("")}
            </div>
          </div>
        </section>
      `;

  const authModal = `
  <div id="authModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 id="modalTitle" class="text-2xl font-bold mb-4 text-center"></h2>
      <form id="authForm" class="space-y-4">
        <input type="text" id="nameField" placeholder="Full Name" class="w-full border p-2 rounded hidden" />
        <input type="email" id="emailField" placeholder="Email" class="w-full border p-2 rounded" required />
        <input type="password" id="passwordField" placeholder="Password" class="w-full border p-2 rounded" required />
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-semibold"></button>
      </form>
      <button id="closeModal" class="mt-4 text-gray-500 hover:text-gray-800 w-full text-center">Close</button>
    </div>
  </div>`;

  const cartModal = `
  <div id="cartModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 class="text-2xl font-bold mb-4 text-center">Your Cart</h2>
      <div id="cartItems" class="space-y-4 max-h-80 overflow-y-auto"></div>
      <div class="mt-4 text-center font-semibold text-lg">Total: ₹<span id="cartTotal">0.00</span></div>
      <button id="checkoutBtn" class="w-full mt-4 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700">Proceed to Checkout</button>
      <button id="closeCart" class="mt-3 w-full text-gray-500 hover:text-gray-800">Close</button>
    </div>
  </div>`;

  const footerSection = `
    <footer class="bg-gray-900 text-white py-12" data-gjs-type="footer-block">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-400">&copy; 2025 ${store.name}. All rights reserved. | Powered by Hive Hub</p>
      </div>
    </footer>`;

  const scriptSection = `
  <script>
    const storeId = "${store._id}";
    const API_BASE = "http://localhost:8000/api";
    const USERS_API = API_BASE + "/store-users";
    const WHOP_CHECKOUT_API = API_BASE + "/whop/checkout";
    const ORDERS_API = API_BASE + "/orders";

    // === AUTH LOGIC ===
    const modal = document.getElementById("authModal");
    const modalTitle = document.getElementById("modalTitle");
    const authForm = document.getElementById("authForm");
    const submitBtn = authForm.querySelector("button");
    const nameField = document.getElementById("nameField");
    const emailField = document.getElementById("emailField");
    const passwordField = document.getElementById("passwordField");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const closeModal = document.getElementById("closeModal");

    let currentMode = "login";

    function openModal(mode) {
      currentMode = mode;
      modalTitle.textContent = mode === "login" ? "Login" : "Register";
      submitBtn.textContent = mode === "login" ? "Login" : "Register";
      nameField.classList.toggle("hidden", mode !== "register");
      modal.classList.remove("hidden");
    }

    function closeModalFn() {
      modal.classList.add("hidden");
    }

    loginBtn.addEventListener("click", () => openModal("login"));
    registerBtn.addEventListener("click", () => openModal("register"));
    closeModal.addEventListener("click", closeModalFn);

    const storeUser = JSON.parse(localStorage.getItem("storeUser"));
    if (storeUser) {
      loginBtn.textContent = "Logout (" + storeUser.name + ")";
      registerBtn.style.display = "none";
      loginBtn.onclick = () => {
        localStorage.removeItem("storeUser");
        localStorage.removeItem("storeToken");
        alert("Logged out successfully!");
        window.location.reload();
      };
    }

    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = nameField.value;
      const email = emailField.value;
      const password = passwordField.value;
      const body = currentMode === "login" ? { email, password, storeId } : { name, email, password, storeId };

      try {
        const res = await fetch(\`\${USERS_API}/\${currentMode}\`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("storeUser", JSON.stringify(data.user));
          localStorage.setItem("storeToken", data.token);
          alert(\`\${currentMode} successful! Welcome, \${data.user.name}\`);
          closeModalFn();
          window.location.reload();
        } else {
          alert(data.message || "Something went wrong");
        }
      } catch (err) {
        alert("Network error: " + err.message);
      }
    });

    // === CART LOGIC ===
    const cartIcon = document.getElementById("cartIcon");
    const cartCount = document.getElementById("cartCount");
    const cartModal = document.getElementById("cartModal");
    const closeCart = document.getElementById("closeCart");
    const cartItemsDiv = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");

    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cartCount.textContent = cart.length;
      cartCount.classList.toggle("hidden", cart.length === 0);
    }

    updateCartCount();

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart-btn")) {
        const name = e.target.dataset.name;
        const price = parseFloat(e.target.dataset.price || 0);
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ name, price });
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        e.target.textContent = "Added!";
        e.target.classList.replace("bg-blue-600", "bg-green-600");
        setTimeout(() => {
          e.target.textContent = "Add to Cart";
          e.target.classList.replace("bg-green-600", "bg-blue-600");
        }, 1000);
      }
    });

    cartIcon.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cartItemsDiv.innerHTML = cart.length
        ? cart.map(item => \`<div class="flex justify-between border-b pb-2"><span>\${item.name}</span><span>₹\${item.price}</span></div>\`).join("")
        : "<p class='text-center text-gray-500'>Your cart is empty.</p>";
      const total = cart.reduce((sum, i) => sum + Number(i.price), 0);
      cartTotal.textContent = total.toFixed(2);
      cartModal.classList.remove("hidden");
    });

    closeCart.addEventListener("click", () => cartModal.classList.add("hidden"));

    checkoutBtn.addEventListener("click", async () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (!cart.length) return alert("Your cart is empty!");

      try {
        const storeUser = JSON.parse(localStorage.getItem("storeUser"));
        const token = localStorage.getItem("storeToken");

        const orderBody = {
        storeId,
        userId: storeUser?.id || undefined, // guests allowed
        items: cart.map(i => ({
          name: i.name || "Unnamed Product",
          price: Number(i.price) || 0,   // ensure number
          quantity: Number(i.quantity) || 1
        })),
        status: "pending"
      };


        const orderRes = await fetch(\`\${ORDERS_API}/create\`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: \`Bearer \${token}\` } : {})
          },
          body: JSON.stringify(orderBody),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) return alert(orderData.message || "Failed to create order");

        const createdOrder = orderData.order;
        const orderId = createdOrder._id || createdOrder.orderId;

        const redirectUrl = \`\${window.location.origin}/store/\${storeId}/checkout-success?orderId=\${orderId}\`;
        const planId = "plan_2nmlTo9tmKpBF";

        const whopRes = await fetch(WHOP_CHECKOUT_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId, cart, storeId, orderId, redirectUrl }),
        });

        const whopData = await whopRes.json();
        if (!whopRes.ok) return alert(whopData.message || "Failed to start checkout");

        const purchaseUrl = whopData.purchaseUrl || whopData.checkoutUrl || whopData.url;
        if (!purchaseUrl) return alert("Checkout URL missing from server response");

        window.location.href = purchaseUrl;
      } catch (err) {
        console.error("Checkout error:", err);
        alert("Error starting checkout: " + err.message);
      }
    });
  </script>
  `;

  return {
    headerSection,
    heroSection,
    productsGrid,
    authModal,
    cartModal,
    footerSection,
    scriptSection,
  };
};
