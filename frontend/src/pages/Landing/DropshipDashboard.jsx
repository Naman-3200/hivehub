// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { 
//   Store, 
//   Plus, 
//   Search, 
//   TrendingUp, 
//   Calendar, 
//   DollarSign, 
//   Package, 
//   Edit3, 
//   Eye, 
//   ExternalLink,
//   Wand2,
//   ShoppingCart,
//   Star,
//   Heart,
//   Filter,
//   Grid,
//   List,
//   X,
//   Check,
//   Upload,
//   Globe,
//   Settings
// } from 'lucide-react';

// const DropshipDashboard = () => {
//   const [currentView, setCurrentView] = useState('dashboard');
//   const [stores, setStores] = useState([]);
//   const [selectedStore, setSelectedStore] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [inventory, setInventory] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('trending');
//   const [searchQuery, setSearchQuery] = useState('');

//   // Mock data for products
//   const mockProducts = {
//     trending: [
//       {
//         id: 1,
//         name: "Wireless Bluetooth Earbuds",
//         price: 29.99,
//         originalPrice: 59.99,
//         image: "https://via.placeholder.com/300x300/4F46E5/white?text=Earbuds",
//         description: "High-quality wireless earbuds with noise cancellation and 24-hour battery life.",
//         rating: 4.5,
//         reviews: 2847,
//         category: "electronics"
//       },
//       {
//         id: 2,
//         name: "Smart Fitness Watch",
//         price: 89.99,
//         originalPrice: 149.99,
//         image: "https://via.placeholder.com/300x300/10B981/white?text=Watch",
//         description: "Track your health and fitness with this advanced smartwatch featuring heart rate monitoring.",
//         rating: 4.3,
//         reviews: 1924,
//         category: "electronics"
//       },
//       {
//         id: 3,
//         name: "Portable Phone Charger",
//         price: 19.99,
//         originalPrice: 39.99,
//         image: "https://via.placeholder.com/300x300/F59E0B/white?text=Charger",
//         description: "10000mAh portable power bank with fast charging capability.",
//         rating: 4.6,
//         reviews: 3521,
//         category: "electronics"
//       }
//     ],
//     revenue: [
//       {
//         id: 4,
//         name: "Premium Laptop Stand",
//         price: 49.99,
//         originalPrice: 79.99,
//         image: "https://via.placeholder.com/300x300/8B5CF6/white?text=Stand",
//         description: "Ergonomic aluminum laptop stand for better posture and cooling.",
//         rating: 4.7,
//         reviews: 1456,
//         category: "electronics"
//       },
//       {
//         id: 5,
//         name: "Wireless Charging Pad",
//         price: 24.99,
//         originalPrice: 44.99,
//         image: "https://via.placeholder.com/300x300/EF4444/white?text=Charger",
//         description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
//         rating: 4.4,
//         reviews: 987,
//         category: "electronics"
//       }
//     ],
//     new: [
//       {
//         id: 6,
//         name: "Smart Home Security Camera",
//         price: 69.99,
//         originalPrice: 99.99,
//         image: "https://via.placeholder.com/300x300/06B6D4/white?text=Camera",
//         description: "1080p HD security camera with night vision and mobile app control.",
//         rating: 4.2,
//         reviews: 543,
//         category: "electronics"
//       }
//     ]
//   };

//   // Create local website function
//   const createLocalWebsite = (store) => {
//     const publishedProducts = inventory.filter(item => item.storeId === store.id && item.published);
//     const websiteContent = generateWebsiteContent(store, publishedProducts);
    
//     // Create a blob URL for the website
//     const blob = new Blob([websiteContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
    
//     // Update store with the local URL
//     const updatedStore = { ...store, localUrl: url };
//     setStores(stores.map(s => s.id === store.id ? updatedStore : s));
    
//     if (selectedStore && selectedStore.id === store.id) {
//       setSelectedStore(updatedStore);
//     }
    
//     return url;
//   };

//   // Open store website
//   const openStoreWebsite = (store) => {
//     if (!store.localUrl) {
//       const url = createLocalWebsite(store);
//       window.open(url, '_blank');
//     } else {
//       // Recreate with updated products
//       const url = createLocalWebsite(store);
//       window.open(url, '_blank');
//     }
//   };
//   const storeCategories = [
//     { id: 'electronics', name: 'Electronics', icon: '📱' },
//     { id: 'fashion', name: 'Fashion', icon: '👕' },
//     { id: 'health', name: 'Health & Beauty', icon: '💄' },
//     { id: 'home', name: 'Home & Garden', icon: '🏠' },
//     { id: 'sports', name: 'Sports & Outdoor', icon: '⚽' },
//     { id: 'pets', name: 'Pet Supplies', icon: '🐕' }
//   ];

//   const [newStore, setNewStore] = useState({
//     name: '',
//     category: '',
//     description: ''
//   });

//   // Generate local store URL
//   const generateStoreUrl = (storeName) => {
//     const storeId = storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
//     return `http://localhost:5173/store/${storeId}`;
//   };

//   // Generate dynamic website content
//   const generateWebsiteContent = (store, publishedProducts) => {
//     return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>${store.name} - Online Store</title>
//     <script src="https://cdn.tailwindcss.com"></script>
//     <style>
//         .product-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
//         .hero-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
//     </style>
// </head>
// <body class="bg-gray-50">
//     <!-- Header -->
//     <header class="bg-white shadow-sm">
//         <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div class="flex justify-between items-center h-16">
//                 <div class="flex items-center">
//                     <h1 class="text-2xl font-bold text-gray-900">${store.name}</h1>
//                     <span class="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">${store.category}</span>
//                 </div>
//                 <nav class="flex space-x-8">
//                     <a href="#products" class="text-gray-600 hover:text-gray-900">Products</a>
//                     <a href="#about" class="text-gray-600 hover:text-gray-900">About</a>
//                     <a href="#contact" class="text-gray-600 hover:text-gray-900">Contact</a>
//                 </nav>
//             </div>
//         </div>
//     </header>

//     <!-- Hero Section -->
//     <section class="hero-gradient text-white py-20">
//         <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <h2 class="text-4xl font-bold mb-4">Welcome to ${store.name}</h2>
//             <p class="text-xl mb-8">${store.description || `Your trusted ${store.category} store with amazing products at great prices!`}</p>
//             <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
//                 Shop Now
//             </a>
//         </div>
//     </section>

//     <!-- Products Section -->
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
//                             <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
//                             <div class="p-6">
//                                 <h3 class="font-semibold text-gray-900 mb-2">${product.name}</h3>
//                                 <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
//                                 <div class="flex items-center justify-between">
//                                     <div>
//                                         <span class="text-lg font-bold text-gray-900">${product.sellingPrice}</span>
//                                         ${product.price !== product.sellingPrice ? `<span class="ml-2 text-sm text-gray-500 line-through">${product.price}</span>` : ''}
//                                     </div>
//                                     <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//                                         Add to Cart
//                                     </button>
//                                 </div>
//                                 <div class="mt-3 flex items-center">
//                                     <div class="flex items-center">
//                                         ${Array(5).fill(0).map((_, i) => `
//                                             <svg class="w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
//                                             </svg>
//                                         `).join('')}
//                                     </div>
//                                     <span class="ml-2 text-sm text-gray-600">(${product.reviews || 0})</span>
//                                 </div>
//                             </div>
//                         </div>
//                     `).join('')}
//                 </div>
//             `}
//         </div>
//     </section>

//     <!-- Footer -->
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

//     <script>
//         // Simple cart functionality
//         let cart = [];
        
//         document.addEventListener('click', function(e) {
//             if (e.target.textContent === 'Add to Cart') {
//                 e.preventDefault();
//                 const productCard = e.target.closest('.product-card');
//                 const productName = productCard.querySelector('h3').textContent;
//                 const productPrice = productCard.querySelector('.text-lg.font-bold').textContent;
                
//                 cart.push({name: productName, price: productPrice});
//                 e.target.textContent = 'Added!';
//                 e.target.classList.remove('bg-blue-600', 'hover:bg-blue-700');
//                 e.target.classList.add('bg-green-600');
                
//                 setTimeout(() => {
//                     e.target.textContent = 'Add to Cart';
//                     e.target.classList.remove('bg-green-600');
//                     e.target.classList.add('bg-blue-600', 'hover:bg-blue-700');
//                 }, 2000);
                
//                 alert(\`Added "\${productName}" to cart! Total items: \${cart.length}\`);
//             }
//         });

//         // Smooth scrolling
//         document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//             anchor.addEventListener('click', function (e) {
//                 e.preventDefault();
//                 const target = document.querySelector(this.getAttribute('href'));
//                 if (target) {
//                     target.scrollIntoView({behavior: 'smooth'});
//                 }
//             });
//         });
//     </script>
// </body>
// </html>`;
//   };

//   // Create store function
//   const createStore = () => {
//     if (newStore.name && newStore.category) {
//       const store = {
//         id: Date.now(),
//         name: newStore.name,
//         category: newStore.category,
//         description: newStore.description,
//         url: generateStoreUrl(newStore.name),
//         products: 0,
//         revenue: 0,
//         orders: 0,
//         created: new Date().toLocaleDateString()
//       };
//       setStores([...stores, store]);
//       setSelectedStore(store);
//       setNewStore({ name: '', category: '', description: '' });
//       setCurrentView('products');
//     }
//   };

//   // Add product to inventory
//   const addToInventory = (product) => {
//     const inventoryItem = {
//       ...product,
//       inventoryId: Date.now(),
//       quantity: 10,
//       sellingPrice: product.price * 1.5,
//       published: false,
//       storeId: selectedStore?.id
//     };
//     setInventory([...inventory, inventoryItem]);
//     setShowProductModal(false);
//   };

//   // Update inventory item
//   const updateInventoryItem = (id, updates) => {
//     setInventory(inventory.map(item => 
//       item.inventoryId === id ? { ...item, ...updates } : item
//     ));
//   };

//   // Publish product to website
//   const publishProduct = (inventoryId) => {
//     updateInventoryItem(inventoryId, { published: true });
    
//     // Auto-update the store website if it exists
//     if (selectedStore) {
//       setTimeout(() => {
//         createLocalWebsite(selectedStore);
//       }, 100);
//     }
//   };

//   // AI generate function (mock)
//   const generateWithAI = (field, currentValue) => {
//     const aiSuggestions = {
//       name: "Smart Wireless Bluetooth Earbuds Pro",
//       description: "Experience premium sound quality with these advanced wireless earbuds featuring active noise cancellation, 30-hour battery life, and IPX7 water resistance. Perfect for music lovers and professionals.",
//       price: "34.99"
//     };
//     return aiSuggestions[field] || currentValue;
//   };

//   // Filter products based on search
//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const currentProducts = searchQuery ? filteredProducts : mockProducts[activeTab] || [];

//   // Dashboard metrics
//   const dashboardMetrics = {
//     totalRevenue: inventory.reduce((sum, item) => sum + (item.published ? item.sellingPrice * 5 : 0), 0),
//     totalOrders: inventory.filter(item => item.published).length * 3,
//     totalProducts: inventory.filter(item => item.published).length,
//     storeViews: selectedStore ? 1247 : 0
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <Store className="h-8 w-8 text-blue-600" />
//               <span className="ml-2 text-xl font-bold text-gray-900">DropShip Pro</span>
//             </div>
//             <nav className="flex space-x-8">
//               <button
//                 onClick={() => setCurrentView('dashboard')}
//                 className={`px-3 py-2 text-sm font-medium ${
//                   currentView === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
//                 }`}
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => setCurrentView('stores')}
//                 className={`px-3 py-2 text-sm font-medium ${
//                   currentView === 'stores' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
//                 }`}
//               >
//                 Stores
//               </button>
//               <button
//                 onClick={() => setCurrentView('products')}
//                 className={`px-3 py-2 text-sm font-medium ${
//                   currentView === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
//                 }`}
//               >
//                 Products
//               </button>
//               <button
//                 onClick={() => setCurrentView('inventory')}
//                 className={`px-3 py-2 text-sm font-medium ${
//                   currentView === 'inventory' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
//                 }`}
//               >
//                 Inventory
//               </button>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Dashboard View */}
//         {currentView === 'dashboard' && (
//           <div>
//             <div className="mb-8">
//               <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//               <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
//             </div>

//             {/* Metrics Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <DollarSign className="h-8 w-8 text-green-600" />
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                     <p className="text-2xl font-bold text-gray-900">${dashboardMetrics.totalRevenue.toFixed(2)}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <ShoppingCart className="h-8 w-8 text-blue-600" />
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                     <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.totalOrders}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <Package className="h-8 w-8 text-purple-600" />
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Products</p>
//                     <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.totalProducts}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <Eye className="h-8 w-8 text-orange-600" />
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Store Views</p>
//                     <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.storeViews}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <button
//                   onClick={() => setCurrentView('stores')}
//                   className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
//                 >
//                   <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm font-medium text-gray-600">Create New Store</p>
//                 </button>
//                 <button
//                   onClick={() => setCurrentView('products')}
//                   className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
//                 >
//                   <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm font-medium text-gray-600">Add Products</p>
//                 </button>
//                 <button
//                   onClick={() => setCurrentView('inventory')}
//                   className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
//                 >
//                   <Settings className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm font-medium text-gray-600">Manage Inventory</p>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Stores View */}
//         {currentView === 'stores' && (
//           <div>
//             <div className="flex justify-between items-center mb-8">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
//                 <p className="text-gray-600">Create and manage your online stores</p>
//               </div>
//               <button
//                 onClick={() => setCurrentView('create-store')}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
//               >
//                 <Plus className="h-5 w-5 mr-2" />
//                 Create Store
//               </button>
//             </div>

//             {stores.length === 0 ? (
//               <div className="bg-white p-12 rounded-lg shadow text-center">
//                 <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                 <h2 className="text-xl font-semibold text-gray-900 mb-2">No stores yet</h2>
//                 <p className="text-gray-600 mb-6">Create your first store to start selling products</p>
//                 <button
//                   onClick={() => setCurrentView('create-store')}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//                 >
//                   Create Your First Store
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {stores.map(store => (
//                   <div key={store.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
//                         <p className="text-sm text-gray-600 capitalize">{store.category}</p>
//                       </div>
//                       <button
//                         onClick={() => {
//                           setSelectedStore(store);
//                           setCurrentView('products');
//                         }}
//                         className="text-blue-600 hover:text-blue-800"
//                       >
//                         <ExternalLink className="h-5 w-5" />
//                       </button>
//                     </div>
//                     <div className="space-y-2 mb-4">
//                       <div className="flex justify-between">
//                         <span className="text-sm text-gray-600">Products:</span>
//                         <span className="text-sm font-medium">{store.products}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm text-gray-600">Revenue:</span>
//                         <span className="text-sm font-medium">${store.revenue}</span>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <button
//                         onClick={() => openStoreWebsite(store)}
//                         className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
//                       >
//                         <Globe className="h-4 w-4 mr-1" />
//                         View Live Store
//                       </button>
//                       <button
//                         onClick={() => {
//                           setSelectedStore(store);
//                           setCurrentView('inventory');
//                         }}
//                         className="text-sm text-gray-600 hover:text-gray-800"
//                       >
//                         Manage
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Create Store View */}
//         {currentView === 'create-store' && (
//           <div>
//             <div className="mb-8">
//               <h1 className="text-2xl font-bold text-gray-900">Create New Store</h1>
//               <p className="text-gray-600">Set up your online store in just a few steps</p>
//             </div>

//             <div className="max-w-2xl mx-auto">
//               <div className="bg-white p-8 rounded-lg shadow">
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Store Name
//                     </label>
//                     <input
//                       type="text"
//                       value={newStore.name}
//                       onChange={(e) => setNewStore({...newStore, name: e.target.value})}
//                       placeholder="Enter your store name"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       What do you want to sell?
//                     </label>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                       {storeCategories.map(category => (
//                         <button
//                           key={category.id}
//                           onClick={() => setNewStore({...newStore, category: category.id})}
//                           className={`p-4 border rounded-lg text-center transition-colors ${
//                             newStore.category === category.id
//                               ? 'border-blue-500 bg-blue-50 text-blue-700'
//                               : 'border-gray-300 hover:border-gray-400'
//                           }`}
//                         >
//                           <div className="text-2xl mb-2">{category.icon}</div>
//                           <div className="text-sm font-medium">{category.name}</div>
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Store Description (Optional)
//                     </label>
//                     <textarea
//                       value={newStore.description}
//                       onChange={(e) => setNewStore({...newStore, description: e.target.value})}
//                       placeholder="Describe what your store is about"
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div className="flex justify-between">
//                     <button
//                       onClick={() => setCurrentView('stores')}
//                       className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                     >
//                       Cancel
//                     </button>
//                     <div className="space-x-3">
//                       <button
//                         onClick={createStore}
//                         disabled={!newStore.name || !newStore.category}
//                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         Generate Website
//                       </button>
//                       <button
//                         onClick={() => {
//                           createStore();
//                           alert('Shopify integration would be implemented here');
//                         }}
//                         disabled={!newStore.name || !newStore.category}
//                         className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         Create Shopify Store
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Products View */}
//         {currentView === 'products' && (
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Products</h1>
//                 <p className="text-gray-600">
//                   {selectedStore ? `Add products to ${selectedStore.name}` : 'Select products to add to your inventory'}
//                 </p>
//               </div>
//               {selectedStore && (
//                 <div className="text-sm text-gray-600">
//                   Store: <span className="font-medium">{selectedStore.name}</span>
//                 </div>
//               )}
//             </div>

//             {/* Search and Tabs */}
//             <div className="bg-white p-4 rounded-lg shadow mb-6">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//                 <div className="flex space-x-4">
//                   {[
//                     { id: 'trending', label: 'Trending', icon: TrendingUp },
//                     { id: 'revenue', label: 'Revenue Based', icon: DollarSign },
//                     { id: 'new', label: 'New Arrivals', icon: Calendar }
//                   ].map(tab => (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
//                         activeTab === tab.id
//                           ? 'bg-blue-100 text-blue-700'
//                           : 'text-gray-600 hover:bg-gray-100'
//                       }`}
//                     >
//                       <tab.icon className="h-4 w-4 mr-2" />
//                       {tab.label}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="relative">
//                   <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search products..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Products Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {currentProducts.map(product => (
//                 <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="p-4">
//                     <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
//                     <div className="flex items-center mb-2">
//                       <div className="flex items-center">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className={`h-4 w-4 ${
//                               i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
//                             }`}
//                           />
//                         ))}
//                         <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between mb-3">
//                       <div>
//                         <span className="text-lg font-bold text-gray-900">${product.price}</span>
//                         <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice}</span>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => {
//                         setSelectedProduct(product);
//                         setShowProductModal(true);
//                       }}
//                       className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Inventory View */}
//         {currentView === 'inventory' && (
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
//                 <p className="text-gray-600">Manage your products and pricing</p>
//               </div>
//               <button
//                 onClick={() => setCurrentView('products')}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
//               >
//                 <Plus className="h-5 w-5 mr-2" />
//                 Add Products
//               </button>
//             </div>

//             {inventory.length === 0 ? (
//               <div className="bg-white p-12 rounded-lg shadow text-center">
//                 <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                 <h2 className="text-xl font-semibold text-gray-900 mb-2">No products in inventory</h2>
//                 <p className="text-gray-600 mb-6">Add products from our catalog to start selling</p>
//                 <button
//                   onClick={() => setCurrentView('products')}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//                 >
//                   Browse Products
//                 </button>
//               </div>
//             ) : (
//               <div className="bg-white rounded-lg shadow overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Price</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {inventory.map(item => (
//                         <InventoryRow
//                           key={item.inventoryId}
//                           item={item}
//                           onUpdate={updateInventoryItem}
//                           onPublish={publishProduct}
//                           generateWithAI={generateWithAI}
//                         />
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {selectedStore && inventory.some(item => item.published && item.storeId === selectedStore.id) && (
//               <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="text-lg font-semibold text-blue-900 mb-2">🎉 Your Store is Live!</h3>
//                     <p className="text-blue-700 mb-2">
//                       Your store "<strong>{selectedStore.name}</strong>" is ready with {inventory.filter(item => item.published && item.storeId === selectedStore.id).length} published products!
//                     </p>
//                     <p className="text-blue-600 text-sm">
//                       Click the button to view your live local website →
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => openStoreWebsite(selectedStore)}
//                     className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center shadow-lg transition-all transform hover:scale-105"
//                   >
//                     <Globe className="h-5 w-5 mr-2" />
//                     Open Live Store
//                   </button>
//                 </div>
//                 <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
//                   <h4 className="font-semibold text-gray-900 mb-2">✨ What customers will see:</h4>
//                   <ul className="text-sm text-gray-600 space-y-1">
//                     <li>• Beautiful responsive design that works on all devices</li>
//                     <li>• Your {inventory.filter(item => item.published && item.storeId === selectedStore.id).length} products with images, descriptions, and pricing</li>
//                     <li>• Professional storefront with your branding</li>
//                     <li>• Working "Add to Cart" functionality</li>
//                     <li>• Contact information and store details</li>
//                   </ul>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </main>

//       {/* Product Modal */}
//       {showProductModal && selectedProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b">
//               <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
//               <button
//                 onClick={() => setShowProductModal(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
            
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <img
//                     src={selectedProduct.image}
//                     alt={selectedProduct.name}
//                     className="w-full h-64 object-cover rounded-lg"
//                   />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-3">{selectedProduct.name}</h3>
//                   <div className="flex items-center mb-3">
//                     <div className="flex items-center">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`h-4 w-4 ${
//                             i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
//                           }`}
//                         />
//                       ))}
//                       <span className="ml-2 text-sm text-gray-600">({selectedProduct.reviews} reviews)</span>
//                     </div>
//                   </div>
//                   <div className="mb-4">
//                     <span className="text-2xl font-bold text-gray-900">${selectedProduct.price}</span>
//                     <span className="ml-2 text-lg text-gray-500 line-through">${selectedProduct.originalPrice}</span>
//                   </div>
//                   <div className="mb-6">
//                     <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
//                     <p className="text-gray-600">{selectedProduct.description}</p>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Cost Price:</span>
//                       <span className="font-medium">${selectedProduct.price}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Suggested Retail:</span>
//                       <span className="font-medium">${(selectedProduct.price * 1.5).toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Potential Profit:</span>
//                       <span className="font-medium text-green-600">${(selectedProduct.price * 0.5).toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowProductModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => addToInventory(selectedProduct)}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Add to Inventory
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Inventory Row Component
// const InventoryRow = ({ item, onUpdate, onPublish, generateWithAI }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editData, setEditData] = useState({
//     name: item.name,
//     sellingPrice: item.sellingPrice,
//     quantity: item.quantity,
//     description: item.description
//   });

//   const handleSave = () => {
//     onUpdate(item.inventoryId, editData);
//     setIsEditing(false);
//   };

//   const handleAIGenerate = (field) => {
//     const newValue = generateWithAI(field, editData[field]);
//     setEditData({ ...editData, [field]: newValue });
//   };

//   if (isEditing) {
//     return (
//       <tr className="bg-blue-50">
//         <td className="px-6 py-4">
//           <div className="flex items-center">
//             <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover mr-3" />
//             <div>
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="text"
//                   value={editData.name}
//                   onChange={(e) => setEditData({...editData, name: e.target.value})}
//                   className="font-medium text-gray-900 border rounded px-2 py-1 text-sm"
//                 />
//                 <button
//                   onClick={() => handleAIGenerate('name')}
//                   className="text-purple-600 hover:text-purple-800"
//                   title="Generate with AI"
//                 >
//                   <Wand2 className="h-4 w-4" />
//                 </button>
//               </div>
//               <div className="flex items-center space-x-2 mt-1">
//                 <input
//                   type="text"
//                   value={editData.description}
//                   onChange={(e) => setEditData({...editData, description: e.target.value})}
//                   className="text-gray-500 text-xs border rounded px-2 py-1"
//                   placeholder="Description"
//                 />
//                 <button
//                   onClick={() => handleAIGenerate('description')}
//                   className="text-purple-600 hover:text-purple-800"
//                   title="Generate with AI"
//                 >
//                   <Wand2 className="h-3 w-3" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </td>
//         <td className="px-6 py-4 text-sm text-gray-900">${item.price}</td>
//         <td className="px-6 py-4">
//           <div className="flex items-center space-x-2">
//             <input
//               type="number"
//               value={editData.sellingPrice}
//               onChange={(e) => setEditData({...editData, sellingPrice: parseFloat(e.target.value)})}
//               className="text-sm border rounded px-2 py-1 w-20"
//               step="0.01"
//             />
//             <button
//               onClick={() => handleAIGenerate('price')}
//               className="text-purple-600 hover:text-purple-800"
//               title="Generate with AI"
//             >
//               <Wand2 className="h-4 w-4" />
//             </button>
//           </div>
//         </td>
//         <td className="px-6 py-4">
//           <input
//             type="number"
//             value={editData.quantity}
//             onChange={(e) => setEditData({...editData, quantity: parseInt(e.target.value)})}
//             className="text-sm border rounded px-2 py-1 w-16"
//           />
//         </td>
//         <td className="px-6 py-4">
//           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//             item.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//           }`}>
//             {item.published ? 'Published' : 'Draft'}
//           </span>
//         </td>
//         <td className="px-6 py-4 text-sm font-medium space-x-2">
//           <button
//             onClick={handleSave}
//             className="text-green-600 hover:text-green-900"
//           >
//             <Check className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => setIsEditing(false)}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </td>
//       </tr>
//     );
//   }

//   return (
//     <tr>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex items-center">
//           <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover mr-3" />
//           <div>
//             <div className="text-sm font-medium text-gray-900">{item.name}</div>
//             <div className="text-sm text-gray-500">{item.category}</div>
//           </div>
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price}</td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.sellingPrice}</td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//           item.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//         }`}>
//           {item.published ? 'Published' : 'Draft'}
//         </span>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//         <button
//           onClick={() => setIsEditing(true)}
//           className="text-blue-600 hover:text-blue-900"
//         >
//           <Edit3 className="h-4 w-4" />
//         </button>
//         {!item.published && (
//           <button
//             onClick={() => onPublish(item.inventoryId)}
//             className="text-green-600 hover:text-green-900"
//             title="Publish to website"
//           >
//             <Upload className="h-4 w-4" />
//           </button>
//         )}
//         <button className="text-gray-400 hover:text-gray-600">
//           <Eye className="h-4 w-4" />
//         </button>
//       </td>
//     </tr>
//   );
// };

// export default DropshipDashboard;






// import React, { useState, useEffect } from 'react';
// import { 
//   Store, Plus, Search, TrendingUp, Calendar, DollarSign, Package, Edit3, Eye, ExternalLink,
//   Wand2, ShoppingCart, Star, X, Check, Upload, Globe, Settings, Loader
// } from 'lucide-react';

// const DropshipDashboard = () => {
//   const [currentView, setCurrentView] = useState('dashboard');
//   const [stores, setStores] = useState([]);
//   const [selectedStore, setSelectedStore] = useState(null);
//   const [allProductsData, setAllProductsData] = useState([]);
//   const [myProducts, setMyProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('trending');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const token = typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;

//   // Fetch all products from API
//   const fetchProducts = async (page = 1, size = 200) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`https://hivehub-1.onrender.com/api/products?pageNum=${page}&pageSize=${size}`);
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       const data = await res.json();
//       const productsList = data?.data?.list ?? data?.list ?? [];
      
//       if (!Array.isArray(productsList) || productsList.length === 0) {
//         setAllProductsData([]);
//         setError("No products returned from API");
//         return;
//       }

//       const mappedProducts = data.data.list.map((item, index) => {
//         const daysOld = (Date.now() - item.createTime) / (1000 * 60 * 60 * 24);
//         const velocity = (item.listedNum || 0) / Math.max(daysOld, 1);

//         return {
//           id: item.pid || `product-${index}`,
//           name: item.productNameEn || item.productName || "Unknown Product",
//           price: parseFloat(item.sellPrice?.split(" -- ")[0] || "0"),
//           originalPrice: parseFloat(item.sellPrice?.split(" -- ")[1] || item.sellPrice?.split(" -- ")[0] || "0") * 1.3,
//           rating: Math.random() * 2 + 3,
//           reviews: Math.floor(Math.random() * 1000) + 50,
//           category: item.categoryName || "General",
//           image: item.productImage || "https://via.placeholder.com/300x300/4F46E5/white?text=Product",
//           description: item.productNameEn || item.productName || "High-quality product with excellent features.",
//           trending: velocity > 20,
//           bestseller: (item.listedNum || 0) > 0,
//           sku: item.productSku,
//           weight: item.productWeight,
//           isFreeShipping: item.isFreeShipping,
//           createTime: item.createTime,
//           listedNum: item.listedNum
//         };
//       });

//       setAllProductsData(prev => [...prev, ...mappedProducts]);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch user's selected products
//   const fetchMyProducts = async () => {
//     if (!token) return;
//     try {
//       const res = await fetch("https://hivehub-1.onrender.com/api/my-products", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch My Products");
//       const data = await res.json();
//       setMyProducts(data.myProducts || []);
//     } catch (err) {
//       console.error("Error fetching My Products:", err);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//     fetchMyProducts();
//   }, []);

//   // Get products by category
//   const getProductsByCategory = (category) => {
//     switch(category) {
//       case 'trending':
//         return allProductsData.filter(p => p.trending).slice(0, 20);
//       case 'revenue':
//         return allProductsData.sort((a, b) => (b.price - a.price)).slice(0, 20);
//       case 'new':
//         return allProductsData.sort((a, b) => (b.createTime - a.createTime)).slice(0, 20);
//       default:
//         return allProductsData.slice(0, 20);
//     }
//   };

//   // Store categories
//   const storeCategories = [
//     { id: 'electronics', name: 'Electronics', icon: '📱' },
//     { id: 'fashion', name: 'Fashion', icon: '👕' },
//     { id: 'health', name: 'Health & Beauty', icon: '💄' },
//     { id: 'home', name: 'Home & Garden', icon: '🏠' },
//     { id: 'sports', name: 'Sports & Outdoor', icon: '⚽' },
//     { id: 'pets', name: 'Pet Supplies', icon: '🐕' }
//   ];

//   const [newStore, setNewStore] = useState({ name: '', category: '', description: '' });

//   const generateStoreUrl = (storeName) => {
//     const storeId = storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
//     return `http://localhost:3000/store/${storeId}`;
//   };

//   const createStore = () => {
//     if (newStore.name && newStore.category) {
//       const store = {
//         id: Date.now(),
//         name: newStore.name,
//         category: newStore.category,
//         description: newStore.description,
//         url: generateStoreUrl(newStore.name),
//         products: 0,
//         revenue: 0,
//         orders: 0,
//         created: new Date().toLocaleDateString()
//       };
//       setStores([...stores, store]);
//       setSelectedStore(store);
//       setNewStore({ name: '', category: '', description: '' });
//       setCurrentView('products');
//     }
//   };

//   const addToInventory = async (product) => {
//     try {
//       if (token) {
//         const response = await fetch('https://hivehub-1.onrender.com/api/add-to-my-products', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             productId: product.id,
//             sellingPrice: product.price * 1.5,
//             quantity: 10,
//             storeId: selectedStore?.id
//           })
//         });
        
//         if (response.ok) {
//           fetchMyProducts();
//         }
//       }
//       setShowProductModal(false);
//     } catch (error) {
//       console.error('Error adding product to inventory:', error);
//     }
//   };

//   const updateInventoryItem = async (productId, updates) => {
//     try {
//       if (token) {
//         await fetch(`https://hivehub-1.onrender.com/api/update-my-product/${productId}`, {
//           method: 'PUT',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(updates)
//         });
//         fetchMyProducts();
//       }
//     } catch (error) {
//       console.error('Error updating product:', error);
//     }
//   };

//   const publishProduct = async (productId) => {
//     try {
//       if (token) {
//         await fetch(`https://hivehub-1.onrender.com/api/publish-product/${productId}`, {
//           method: 'PUT',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ published: true })
//         });
//         fetchMyProducts();
//         if (selectedStore) {
//           setTimeout(() => createLocalWebsite(selectedStore), 100);
//         }
//       }
//     } catch (error) {
//       console.error('Error publishing product:', error);
//     }
//   };

//   const generateWithAI = (field, currentValue) => {
//     const aiSuggestions = {
//       name: "Smart Wireless Bluetooth Earbuds Pro",
//       description: "Experience premium sound quality with these advanced wireless earbuds featuring active noise cancellation, 30-hour battery life, and IPX7 water resistance.",
//       price: "34.99"
//     };
//     return aiSuggestions[field] || currentValue;
//   };

//   // Generate website content with selected products
//   const generateWebsiteContent = (store, publishedProducts) => {
//     return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>${store.name} - Online Store</title>
//     <script src="https://cdn.tailwindcss.com"></script>
//     <style>
//         .product-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
//         .hero-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
//         .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
//     </style>
// </head>
// <body class="bg-gray-50">
//     <header class="bg-white shadow-sm">
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
//     <section class="hero-gradient text-white py-20">
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
//                                         <span class="text-lg font-bold text-gray-900">$${(product.sellingPrice || product.price).toFixed(2)}</span>
//                                         ${product.originalPrice ? `<span class="ml-2 text-sm text-gray-500 line-through">$${product.originalPrice.toFixed(2)}</span>` : ''}
//                                     </div>
//                                 </div>
//                                 <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" data-product-name="${product.name}" data-product-price="${(product.sellingPrice || product.price).toFixed(2)}">Add to Cart</button>
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
// </body>
// </html>`;
//   };

//   const createLocalWebsite = (store) => {
//     const publishedProducts = myProducts.filter(item => item.published && item.storeId === store.id);
//     const websiteContent = generateWebsiteContent(store, publishedProducts);
//     const blob = new Blob([websiteContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
    
//     const updatedStore = { ...store, localUrl: url };
//     setStores(stores.map(s => s.id === store.id ? updatedStore : s));
//     if (selectedStore && selectedStore.id === store.id) {
//       setSelectedStore(updatedStore);
//     }
//     return url;
//   };

//   const openStoreWebsite = (store) => {
//     const url = createLocalWebsite(store);
//     window.open(url, '_blank');
//   };

//   const filteredProducts = allProductsData.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   const currentProducts = searchQuery ? filteredProducts : getProductsByCategory(activeTab);

//   const dashboardMetrics = {
//     totalRevenue: myProducts.reduce((sum, item) => sum + (item.published ? (item.sellingPrice || 0) * 5 : 0), 0),
//     totalOrders: myProducts.filter(item => item.published).length * 3,
//     totalProducts: myProducts.filter(item => item.published).length,
//     storeViews: selectedStore ? 1247 : 0
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <Store className="h-8 w-8 text-blue-600" />
//               <span className="ml-2 text-xl font-bold text-gray-900">DropShip Pro</span>
//             </div>
//             <nav className="flex space-x-8">
//               <button onClick={() => setCurrentView('dashboard')} className={`px-3 py-2 text-sm font-medium ${currentView === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Dashboard</button>
//               <button onClick={() => setCurrentView('stores')} className={`px-3 py-2 text-sm font-medium ${currentView === 'stores' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Stores</button>
//               <button onClick={() => setCurrentView('products')} className={`px-3 py-2 text-sm font-medium ${currentView === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Products</button>
//               <button onClick={() => setCurrentView('inventory')} className={`px-3 py-2 text-sm font-medium ${currentView === 'inventory' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Inventory</button>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {currentView === 'dashboard' && (
//           <div>
//             <div className="mb-8">
//               <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//               <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <DollarSign className="h-8 w-8 text-green-600" />
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                     <p className="text-2xl font-bold text-gray-900">${dashboardMetrics.totalRevenue.toFixed(2)}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <ShoppingCart className="h-8 w-8 text-blue-600" />
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                     <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.totalOrders}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <Package className="h-8 w-8 text-purple-600" />
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Products</p>
//                     <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.totalProducts}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <Eye className="h-8 w-8 text-orange-600" />
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Store Views</p>
//                     <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.storeViews}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {currentView === 'stores' && (
//           <div>
//             <div className="flex justify-between items-center mb-8">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
//                 <p className="text-gray-600">Create and manage your online stores</p>
//               </div>
//               <button onClick={() => setCurrentView('create-store')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
//                 <Plus className="h-5 w-5 mr-2" />
//                 Create Store
//               </button>
//             </div>

//             {stores.length === 0 ? (
//               <div className="bg-white p-12 rounded-lg shadow text-center">
//                 <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                 <h2 className="text-xl font-semibold text-gray-900 mb-2">No stores yet</h2>
//                 <p className="text-gray-600 mb-6">Create your first store to start selling products</p>
//                 <button onClick={() => setCurrentView('create-store')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
//                   Create Your First Store
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {stores.map(store => (
//                   <div key={store.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
//                         <p className="text-sm text-gray-600 capitalize">{store.category}</p>
//                       </div>
//                       <button onClick={() => { setSelectedStore(store); setCurrentView('products'); }} className="text-blue-600 hover:text-blue-800">
//                         <ExternalLink className="h-5 w-5" />
//                       </button>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <button onClick={() => openStoreWebsite(store)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
//                         <Globe className="h-4 w-4 mr-1" />
//                         View Live Store
//                       </button>
//                       <button onClick={() => { setSelectedStore(store); setCurrentView('inventory'); }} className="text-sm text-gray-600 hover:text-gray-800">
//                         Manage
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {currentView === 'create-store' && (
//           <div>
//             <div className="mb-8">
//               <h1 className="text-2xl font-bold text-gray-900">Create New Store</h1>
//               <p className="text-gray-600">Set up your online store in just a few steps</p>
//             </div>
//             <div className="max-w-2xl mx-auto">
//               <div className="bg-white p-8 rounded-lg shadow">
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
//                     <input type="text" value={newStore.name} onChange={(e) => setNewStore({...newStore, name: e.target.value})} placeholder="Enter your store name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to sell?</label>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                       {storeCategories.map(category => (
//                         <button key={category.id} onClick={() => setNewStore({...newStore, category: category.id})} className={`p-4 border rounded-lg text-center transition-colors ${newStore.category === category.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400'}`}>
//                           <div className="text-2xl mb-2">{category.icon}</div>
//                           <div className="text-sm font-medium">{category.name}</div>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex justify-between">
//                     <button onClick={() => setCurrentView('stores')} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
//                     <button onClick={createStore} disabled={!newStore.name || !newStore.category} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Generate Website</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {currentView === 'products' && (
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Products</h1>
//                 <p className="text-gray-600">{selectedStore ? `Add products to ${selectedStore.name}` : 'Select products to add to your inventory'}</p>
//               </div>
//               {selectedStore && (
//                 <div className="text-sm text-gray-600">Store: <span className="font-medium">{selectedStore.name}</span></div>
//               )}
//             </div>

//             <div className="bg-white p-4 rounded-lg shadow mb-6">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//                 <div className="flex space-x-4">
//                   {[
//                     { id: 'trending', label: 'Trending', icon: TrendingUp },
//                     { id: 'revenue', label: 'Revenue Based', icon: DollarSign },
//                     { id: 'new', label: 'New Arrivals', icon: Calendar }
//                   ].map(tab => (
//                     <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
//                       <tab.icon className="h-4 w-4 mr-2" />
//                       {tab.label}
//                     </button>
//                   ))}











import React, { useState, useEffect } from 'react';
import { 
  Store, Plus, Search, TrendingUp, Calendar, DollarSign, Package, Edit3, Eye, ExternalLink,
  Wand2, ShoppingCart, Star, X, Check, Upload, Globe, Settings, Loader
} from 'lucide-react';

const DropshipDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [allProductsData, setAllProductsData] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  console.log("myproducts:", myProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;


  // Save new store to backend
const saveStoreToBackend = async (storeData) => {
  try {
    if (!token) {
      alert("Please log in first.");
      return null;
    }

    console.log("Saving store data:", storeData);
    const res = await fetch("https://hivehub-1.onrender.com/api/stores", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(storeData)
    });

    if (!res.ok) {
      throw new Error("Failed to save store");
    }

    const data = await res.json();
    return data.store; // Assuming backend returns { store: {...} }
  } catch (err) {
    console.error("Error saving store:", err);
    return null;
  }
};


const fetchStores = async () => {
  try {
    if (!token) return;
    const res = await fetch("https://hivehub-1.onrender.com/api/stores", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch stores");
    const data = await res.json();
    setStores(data.stores || []);
  } catch (err) {
    console.error("Error fetching stores:", err);
  }
};



  // Fetch all products from API
  const fetchProducts = async (page = 1, size = 200) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://hivehub-1.onrender.com/api/products?pageNum=${page}&pageSize=${size}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const productsList = data?.data?.list ?? data?.list ?? [];
      
      if (!Array.isArray(productsList) || productsList.length === 0) {
        setAllProductsData([]);
        setError("No products returned from API");
        return;
      }

      const mappedProducts = data.data.list.map((item, index) => {
        const daysOld = (Date.now() - item.createTime) / (1000 * 60 * 60 * 24);
        const velocity = (item.listedNum || 0) / Math.max(daysOld, 1);

        return {
          id: item.pid || `product-${index}`,
          name: item.productNameEn || item.productName || "Unknown Product",
          price: parseFloat(item.sellPrice?.split(" -- ")[0] || "0"),
          originalPrice: parseFloat(item.sellPrice?.split(" -- ")[1] || item.sellPrice?.split(" -- ")[0] || "0") * 1.3,
          rating: Math.random() * 2 + 3,
          reviews: Math.floor(Math.random() * 1000) + 50,
          category: item.categoryName || "General",
          image: item.productImage || "https://via.placeholder.com/300x300/4F46E5/white?text=Product",
          description: item.productNameEn || item.productName || "High-quality product with excellent features.",
          trending: velocity > 20,
          bestseller: (item.listedNum || 0) > 0,
          sku: item.productSku,
          weight: item.productWeight,
          isFreeShipping: item.isFreeShipping,
          createTime: item.createTime,
          listedNum: item.listedNum
        };
      });

      setAllProductsData(prev => [...prev, ...mappedProducts]);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's selected products
  const fetchMyProducts = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://hivehub-1.onrender.com/api/my-products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch My Products");
      const data = await res.json();
      setMyProducts(data.myProducts || []);
    } catch (err) {
      console.error("Error fetching My Products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMyProducts();
    fetchStores();
  }, []);

  // Get products by category
  const getProductsByCategory = (category) => {
    switch(category) {
      case 'trending':
        return allProductsData.filter(p => p.trending).slice(0, 20);
      case 'revenue':
        return allProductsData.sort((a, b) => (b.price - a.price)).slice(0, 20);
      case 'new':
        return allProductsData.sort((a, b) => (b.createTime - a.createTime)).slice(0, 20);
      default:
        return allProductsData.slice(0, 20);
    }
  };

  // Store categories
  const storeCategories = [
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'health', name: 'Health & Beauty', icon: '💄' },
    { id: 'home', name: 'Home & Garden', icon: '🏠' },
    { id: 'sports', name: 'Sports & Outdoor', icon: '⚽' },
    { id: 'pets', name: 'Pet Supplies', icon: '🐕' }
  ];

  const [newStore, setNewStore] = useState({ name: '', category: '', description: '' });

  const generateStoreUrl = () => {
    // const storeId = storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const storeId = `${newStore.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;


    return `http://localhost:5173/store/${storeId}`;
  };

  const createStore = async () => {
    if (newStore.name && newStore.category) {
      const store = {
        id: Date.now(),
        name: newStore.name,
        category: newStore.category,
        description: newStore.description,
        url: generateStoreUrl(newStore.name),
        products: 0,
        revenue: 0,
        orders: 0,
        created: new Date().toLocaleDateString()
      };
      const savedStore = await saveStoreToBackend(store);
      console.log("Saved store from backend:", savedStore);
      if (savedStore) {
      setStores([...stores, savedStore]);  // ✅ sync local state with backend response
      setSelectedStore(savedStore);
      setNewStore({ name: "", category: "", description: "" });
      setCurrentView("products");
    }
  }
};
  

  const addToInventory = async (product) => {
    try {
      if (!selectedStore?._id) {
      alert("Please select a store first.");
      return;
    }
      console.log("product", product);
      if (token) {
        const response = await fetch('https://hivehub-1.onrender.com/api/my-products', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // productId: product.id,
            // sellingPrice: product.price * 1.5,
            // quantity: 10,
            // storeId: selectedStore?.id
            productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          storeId: selectedStore?._id,
          published: true   // 👈 new line

          })
        });
        
        if (response.ok) {
          fetchMyProducts();
        }
      }
      setShowProductModal(false);
    } catch (error) {
      console.error('Error adding product to inventory:', error);
    }
  };

  const updateInventoryItem = async (productId, updates) => {
    try {
      if (token) {
        await fetch(`https://hivehub-1.onrender.com/api/my-products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        });
        fetchMyProducts();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

const publishProduct = async (product) => {
 console.log("Full product object:", product); // Add this line
 const productIds = product.productId || product.id;
    console.log("Product ID being sent:", product.productId); // Add this line
    
    console.log("Publishing product:", productIds);
    
    if (!productIds) {
        console.error("No productId found!");
        return;
    }

  try {
    if (token) {
      const response = await fetch(`https://hivehub-1.onrender.com/api/publish-to-website/${productIds}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ published: true, storeId: selectedStore?.id })
      });
      console.log("Publish response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to publish:", error);
        return;
      }

      fetchMyProducts();
      if (selectedStore) {
        setTimeout(() => createLocalWebsite(selectedStore), 100);
      }
    }
  } catch (error) {
    console.error('Error publishing product:', error);
  }
};


  const generateWithAI = (field, currentValue) => {
    const aiSuggestions = {
      name: "Custom product",
      description: "Experience premium sound quality with these advanced wireless earbuds featuring active noise cancellation, 30-hour battery life, and IPX7 water resistance.",
      price: "34.99"
    };
    return aiSuggestions[field] || currentValue;
  };


  
  // Generate website content with selected products
  const generateWebsiteContent = (store, publishedProducts) => {
    console.log("publish product",publishedProducts);
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${store.name} - Online Store</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .product-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
        .hero-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    </style>
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <h1 class="text-2xl font-bold text-gray-900">${store.name}</h1>
                    <span class="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">${store.category}</span>
                </div>
                <nav class="flex space-x-8">
                    <a href="#products" class="text-gray-600 hover:text-gray-900">Products</a>
                    <div id="cart-indicator" class="relative">
                        <span class="text-gray-600">🛒</span>
                        <span id="cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center hidden">0</span>
                    </div>
                </nav>
            </div>
        </div>
    </header>
    <section class="hero-gradient text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-4xl font-bold mb-4">Welcome to ${store.name}</h2>
            <p class="text-xl mb-8">${store.description || `Your trusted ${store.category} store with amazing products!`}</p>
            <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Shop Now</a>
        </div>
    </section>
    <section id="products" class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Products</h2>
            
            ${publishedProducts.length === 0 ? `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">📦</div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
                    <p class="text-gray-600">We're adding amazing products to our store. Check back soon!</p>
                </div>
            ` : `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    ${publishedProducts.map(product => `
                        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
                            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" onerror="this.src='https://via.placeholder.com/300x300/4F46E5/white?text=Product'">
                            <div class="p-6">
                                <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${product.name}</h3>
                                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
                                <div class="flex items-center justify-between mb-3">
                                    <div>
                                        <span class="text-lg font-bold text-gray-900">$${(product.sellingPrice || product.price).toFixed(2)}</span>
                                        ${product.originalPrice ? `<span class="ml-2 text-sm text-gray-500 line-through">$${product.originalPrice.toFixed(2)}</span>` : ''}
                                    </div>
                                </div>
                                <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" data-product-name="${product.name}" data-product-price="${(product.sellingPrice || product.price).toFixed(2)}">Add to Cart</button>
                                <div class="mt-3 flex items-center">
                                    <div class="flex items-center">
                                        ${Array(5).fill(0).map((_, i) => `<svg class="w-4 h-4 ${i < Math.floor(product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`).join('')}
                                    </div>
                                    <span class="ml-2 text-sm text-gray-600">(${product.reviews || 0})</span>
                                </div>
                                ${product.isFreeShipping ? '<div class="mt-2"><span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Free Shipping</span></div>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    </section>
    <script>
        let cart = [];
        const cartCountElement = document.getElementById('cart-count');
        
        function updateCartCount() {
            const count = cart.length;
            if (count > 0) {
                cartCountElement.textContent = count;
                cartCountElement.classList.remove('hidden');
            } else {
                cartCountElement.classList.add('hidden');
            }
        }
        
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart-btn')) {
                e.preventDefault();
                const productName = e.target.dataset.productName;
                const productPrice = e.target.dataset.productPrice;
                
                cart.push({name: productName, price: productPrice});
                
                e.target.textContent = 'Added!';
                e.target.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                e.target.classList.add('bg-green-600');
                
                updateCartCount();
                
                setTimeout(() => {
                    e.target.textContent = 'Add to Cart';
                    e.target.classList.remove('bg-green-600');
                    e.target.classList.add('bg-blue-600', 'hover:bg-blue-700');
                }, 2000);
                
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                toast.textContent = \`Added "\${productName}" to cart!\`;
                document.body.appendChild(toast);
                
                setTimeout(() => toast.remove(), 3000);
            }
        });
    </script>
        
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4">${store.name}</h3>
                    <p class="text-gray-400">Your trusted online ${store.category} store.</p>
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

    const createLocalWebsite = (store) => {
    console.log("store store",store);
    const publishedProducts = myProducts.filter(
  item => item.published && String(item.storeId) === String(store._id)
);

    console.log("publishedProducts",publishedProducts);
    const websiteContent = generateWebsiteContent(store, publishedProducts);
    const blob = new Blob([websiteContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const updatedStore = { ...store, localUrl: url };
    setStores(stores.map(s => s.id === store.id ? updatedStore : s));
    if (selectedStore && selectedStore.id === store.id) {
      setSelectedStore(updatedStore);
    }
    return url;
  };



  const openStoreWebsite = (store) => {
    const url = createLocalWebsite(store);
    window.open(url, '_blank');
  };

  const filteredProducts = allProductsData.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentProducts = searchQuery ? filteredProducts : getProductsByCategory(activeTab);

  const dashboardMetrics = {
    totalRevenue: myProducts.reduce((sum, item) => sum + (item.published ? (item.sellingPrice || 0) * 5 : 0), 0),
    totalOrders: myProducts.filter(item => item.published).length * 3,
    totalProducts: myProducts.filter(item => item.published).length,
    storeViews: selectedStore ? 1247 : 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">DropShip Pro</span>
            </div>
            <nav className="flex space-x-8">
              <button onClick={() => setCurrentView('dashboard')} className={`px-3 py-2 text-sm font-medium ${currentView === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Dashboard</button>
              <button onClick={() => setCurrentView('stores')} className={`px-3 py-2 text-sm font-medium ${currentView === 'stores' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Stores</button>
              <button onClick={() => setCurrentView('products')} className={`px-3 py-2 text-sm font-medium ${currentView === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Products</button>
              <button onClick={() => setCurrentView('inventory')} className={`px-3 py-2 text-sm font-medium ${currentView === 'inventory' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Inventory</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${dashboardMetrics.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.totalOrders}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Products</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.totalProducts}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Store Views</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.storeViews}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'stores' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
                <p className="text-gray-600">Create and manage your online stores</p>
              </div>
              <button onClick={() => setCurrentView('create-store')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Create Store
              </button>
            </div>

            {stores.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow text-center">
                <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No stores yet</h2>
                <p className="text-gray-600 mb-6">Create your first store to start selling products</p>
                <button onClick={() => setCurrentView('create-store')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                  Create Your First Store
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map(store => (
                  <div key={store.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{store.category}</p>
                      </div>
                      <button onClick={() => { setSelectedStore(store); setCurrentView('products'); }} className="text-blue-600 hover:text-blue-800">
                        <ExternalLink className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <button onClick={() => openStoreWebsite(store)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        View Live Store
                      </button>
                      <button onClick={() => { setSelectedStore(store); setCurrentView('inventory'); }} className="text-sm text-gray-600 hover:text-gray-800">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'create-store' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create New Store</h1>
              <p className="text-gray-600">Set up your online store in just a few steps</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                    <input type="text" value={newStore.name} onChange={(e) => setNewStore({...newStore, name: e.target.value})} placeholder="Enter your store name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to sell?</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {storeCategories.map(category => (
                        <button key={category.id} onClick={() => setNewStore({...newStore, category: category.id})} className={`p-4 border rounded-lg text-center transition-colors ${newStore.category === category.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400'}`}>
                          <div className="text-2xl mb-2">{category.icon}</div>
                          <div className="text-sm font-medium">{category.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button onClick={() => setCurrentView('stores')} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button onClick={createStore} disabled={!newStore.name || !newStore.category} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Generate Website</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600">{selectedStore ? `Add products to ${selectedStore.name}` : 'Select products to add to your inventory'}</p>
              </div>
              {selectedStore && (
                <div className="text-sm text-gray-600">Store: <span className="font-medium">{selectedStore.name}</span></div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex space-x-4">
                  {[
                    { id: 'trending', label: 'Trending', icon: TrendingUp },
                    { id: 'revenue', label: 'Revenue Based', icon: DollarSign },
                    { id: 'new', label: 'New Arrivals', icon: Calendar }
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading products...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">⚠️ Error loading products</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button onClick={() => fetchProducts()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Retry</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-lg font-bold text-gray-900">${product.price}</span>
                          <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        </div>
                      </div>
                      <button onClick={() => { setSelectedProduct(product); setShowProductModal(true); }} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                <p className="text-gray-600">Manage your products and pricing</p>
              </div>
              <button onClick={() => setCurrentView('products')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Products
              </button>
            </div>

            {myProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No products in inventory</h2>
                <p className="text-gray-600 mb-6">Add products from our catalog to start selling</p>
                <button onClick={() => setCurrentView('products')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Browse Products</button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {myProducts.map(item => (
                        <InventoryRow key={item._id || item.productId} item={item} onUpdate={updateInventoryItem} onPublish={() => publishProduct(item)} generateWithAI={generateWithAI} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedStore && myProducts.some(item => item.published && item.storeId === selectedStore.id) && (
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">🎉 Your Store is Live!</h3>
                    <p className="text-blue-700 mb-2">Your store "<strong>{selectedStore.name}</strong>" is ready with {myProducts.filter(item => item.published && item.storeId === selectedStore.id).length} published products!</p>
                    <p className="text-blue-600 text-sm">Click the button to view your live local website →</p>
                  </div>
                  <button onClick={() => openStoreWebsite(selectedStore)} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center shadow-lg transition-all transform hover:scale-105">
                    <Globe className="h-5 w-5 mr-2" />
                    Open Live Store
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{selectedProduct.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({selectedProduct.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">${selectedProduct.price}</span>
                    <span className="ml-2 text-lg text-gray-500 line-through">${selectedProduct.originalPrice}</span>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cost Price:</span>
                      <span className="font-medium">${selectedProduct.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Suggested Retail:</span>
                      <span className="font-medium">${(selectedProduct.price * 1.5).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Potential Profit:</span>
                      <span className="font-medium text-green-600">${(selectedProduct.price * 0.5).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setShowProductModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => addToInventory(selectedProduct)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add to Inventory</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InventoryRow = ({ item, onUpdate, onPublish, generateWithAI }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    sellingPrice: item.sellingPrice,
    quantity: item.quantity,
    description: item.description
  });

  const handleSave = () => {
    onUpdate(item.id, editData);
    setIsEditing(false);
  };

  const handleAIGenerate = (field) => {
    const newValue = generateWithAI(field, editData[field]);
    setEditData({ ...editData, [field]: newValue });
  };

  if (isEditing) {
    return (
      <tr className="bg-blue-50">
        <td className="px-6 py-4">
          <div className="flex items-center">
            <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover mr-3" />
            <div>
              <div className="flex items-center space-x-2">
                <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="font-medium text-gray-900 border rounded px-2 py-1 text-sm" />
                <button onClick={() => handleAIGenerate('name')} className="text-purple-600 hover:text-purple-800" title="Generate with AI">
                  <Wand2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">${item.price}</td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <input type="number" value={editData.sellingPrice} onChange={(e) => setEditData({...editData, sellingPrice: parseFloat(e.target.value)})} className="text-sm border rounded px-2 py-1 w-20" step="0.01" />
            <button onClick={() => handleAIGenerate('price')} className="text-purple-600 hover:text-purple-800" title="Generate with AI">
              <Wand2 className="h-4 w-4" />
            </button>
          </div>
        </td>
        <td className="px-6 py-4">
          <input type="number" value={editData.quantity} onChange={(e) => setEditData({...editData, quantity: parseInt(e.target.value)})} className="text-sm border rounded px-2 py-1 w-16" />
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {item.published ? 'Published' : 'Draft'}
          </span>
        </td>
        <td className="px-6 py-4 text-sm font-medium space-x-2">
          <button onClick={handleSave} className="text-green-600 hover:text-green-900">
            <Check className="h-4 w-4" />
          </button>
          <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">{item.name}</div>
            <div className="text-sm text-gray-500">{item.category}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.sellingPrice}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {item.published ? 'Published' : 'Draft'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-900">
          <Edit3 className="h-4 w-4" />
        </button>
        {!item.published && (
          <button onClick={onPublish} className="text-green-600 hover:text-green-900" title="Publish to website">
            <Upload className="h-4 w-4" />
          </button>
        )}
        <button className="text-gray-400 hover:text-gray-600">
          <Eye className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
};

export default DropshipDashboard;