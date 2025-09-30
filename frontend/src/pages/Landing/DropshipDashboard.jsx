import React, { useState, useEffect } from 'react';
import { 
  Store, Plus, Search, TrendingUp, Calendar, DollarSign, Package, Edit3, Eye, ExternalLink,
  Wand2, ShoppingCart, Star, X, Check, Upload, Globe, Settings, Loader, Copy, Share2
} from 'lucide-react';
import AddProductModal from '../../components/AddProductModal';
import ViewProduct from '../../components/ViewProduct';

const DropshipDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [allProductsData, setAllProductsData] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  console.log("myproducts:", myProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [viewProductModal, setViewProductModal] = useState(false);
  const [error, setError] = useState(null);
const [showAddProductOptions, setShowAddProductOptions] = useState(false);
const [manualAdd, setManualAdd] = useState(false);
const [aiAdd, setAiAdd] = useState(false);
// const [newProduct, setNewProduct] = useState({
//   name: "",
//   description: "",
//   price: "",
//   image: "",
//   category: "",
// });


const [isEditing, setIsEditing] = useState(false);



  const token = typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;


  // Save new store to backend
const saveStoreToBackend = async (storeData) => {
  try {
    if (!token) {
      alert("Please log in first.");
      return null;
    }

    console.log("Saving store data:", storeData);
    const res = await fetch("http://localhost:8000/api/stores", {
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
    const res = await fetch("http://localhost:8000/api/stores", {
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
      const res = await fetch(`http://localhost:8000/api/products?pageNum=${page}&pageSize=${size}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const productsList = data?.data?.list ?? data?.list ?? [];
      console.log("Fetched products:", productsList);
      if (!Array.isArray(productsList) || productsList.length === 0) {
        setAllProductsData([]);
        setError("No products returned from API");
        return;
      }

      const mappedProducts = data.data.list.map((item, index) => {
        const daysOld = (Date.now() - item.createTime) / (1000 * 60 * 60 * 24);
        const velocity = (item.listedNum || 0) / Math.max(daysOld, 1);

        return {
          id: item.pid,
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
      const res = await fetch("http://localhost:8000/api/my-products", {
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
  // const getProductsByCategory = (category) => {
  //   switch(category) {
  //     case 'trending':
  //       return allProductsData.filter(p => p.trending).slice(0, 20);
  //     case 'revenue':
  //       return allProductsData.sort((a, b) => (b.price - a.price)).slice(0, 20);
  //     case 'new':
  //       return allProductsData.sort((a, b) => (b.createTime - a.createTime)).slice(0, 20);
  //     default:
  //       return allProductsData.slice(0, 20);
  //   }
  // };

  // Replace your getProductsByCategory function
const getProductsByCategory = (category) => {
  const productsCopy = [...allProductsData]; // avoid mutating
  switch (category) {
    case 'trending':
      return productsCopy.filter(p => p.trending).slice(0, 20);
    case 'revenue':
      return productsCopy.sort((a, b) => b.price - a.price).slice(0, 20);
    case 'new':
      return productsCopy.sort((a, b) => b.createTime - a.createTime).slice(0, 20);
    default:
      return productsCopy.slice(0, 20);
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
      // console.log("Saved store from backend:", savedStore);
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
        const response = await fetch('http://localhost:8000/api/my-products', {
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
  // ✅ Toast message
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  toast.textContent = `"${product.name}" added to inventory!`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
      }
      setShowProductModal(false);
    } catch (error) {
      console.error('Error adding product to inventory:', error);
    }
  };

// const updateInventoryItem = async (productId, updates) => {
//   try {
//     if (token) {
//       await fetch(`http://localhost:8000/api/my-products/${productId}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updates)
//       });
//       fetchMyProducts();
//     }
//   } catch (error) {
//     console.error('Error updating product:', error);
//   }
// };

const updateInventoryItem = async (productId, formData) => {
  try {
    for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}

    if (token) {
      const res = await fetch(`http://localhost:8000/api/my-products/update`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
          // ⚠️ Don't set Content-Type manually, browser sets it automatically for FormData
        },
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Update failed", res.status, text);
        return;
      }

      fetchMyProducts();
    }
  } catch (error) {
    console.error("Error updating product:", error);
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
      const response = await fetch(`http://localhost:8000/api/publish-to-website/${productIds}`, {
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

    useEffect(() => {
  if (stores && stores.length > 0) {
    const updatedStores = stores.map((store) => {
      // if blob already created, keep it
      if (store.localUrl && store.localUrl.startsWith("blob:")) return store;

      const blobUrl = createLocalWebsite(store);
      return { ...store, localUrl: blobUrl };
    });
    setStores(updatedStores);
  }
}, []);



  const openStoreWebsite = (store) => {
    // const url = createLocalWebsite(store);

  

    window.open(store.localUrl, '_blank');
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
              <button onClick={() => setCurrentView('notifications')} className={`px-3 py-2 text-sm font-medium ${currentView === 'notifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Notifications</button>
              <button onClick={() => setCurrentView('settings')} className={`px-3 py-2 text-sm font-medium ${currentView === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Settings</button>
              <button onClick={() => setCurrentView('community')} className={`px-3 py-2 text-sm font-medium ${currentView === 'community' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Community</button>

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
              // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              //   {stores.map(store => (
              //     <div key={store.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              //       <div className="flex justify-between items-start mb-4">
              //         <div>
              //           <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
              //           <p className="text-sm text-gray-600 capitalize">{store.category}</p>
              //         </div>
              //         <button onClick={() => { setSelectedStore(store); setCurrentView('products'); }} className="text-blue-600 hover:text-blue-800">
              //           <ExternalLink className="h-5 w-5" />
              //         </button>
              //       </div>
              //       <div className="flex justify-between items-center">
              //         <button onClick={() => openStoreWebsite(store)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              //           <Globe className="h-4 w-4 mr-1" />
              //           View Live Store
              //         </button>
              //         <button onClick={() => { setSelectedStore(store); setCurrentView('inventory'); }} className="text-sm text-gray-600 hover:text-gray-800">
              //           Manage
              //         </button>
              //       </div>
              //     </div>
              //   ))}
              // </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                  
                  <div
                    key={store.id}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{store.category}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedStore(store);
                          setCurrentView("products");
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Store Domain + Copy + Share */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-800 font-medium truncate">
                        {store.localUrl}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(store.localUrl)}
                          className="flex items-center text-xs text-gray-600 hover:text-gray-900"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </button>
                        <button
                          onClick={() =>
                            navigator.share
                              ? navigator.share({
                                  title: store.name,
                                  url: store.localUrl.startsWith("http")
                                    ? store.localUrl
                                    : `https://${store.localUrl}`,
                                })
                              : alert("Sharing not supported on this device")
                          }
                          className="flex items-center text-xs text-gray-600 hover:text-gray-900"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => openStoreWebsite(store)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        View Live Store
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStore(store);
                          setCurrentView("inventory");
                        }}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
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
            <div className="flex justify-end mb-4">
    <button 
      onClick={() => {
        setSelectedProduct(null); // clear product
        setShowProductModal(true);
      }} 
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
    >
      + Add Product
    </button>
   

  </div>
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
                      {/* <button 
                        onClick={() => { 
                          setSelectedProduct(product); 
                          setShowProductModal(true); 
                        }} 
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit Product
                      </button> */}
                      {/* <button onClick={() =>  addToInventory(product)} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">View Details</button> */}
                      <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsEditing(false); // ensure not editing
                        setViewProductModal(true)
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
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

        {currentView === 'orders' && (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Orders</h1>
    <p className="text-gray-600 mb-6">Here’s your order summary</p>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-600">Total Orders</p>
        <p className="text-2xl font-bold text-gray-900">120</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-600">Paid</p>
        <p className="text-2xl font-bold text-green-600">95</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-600">Unpaid</p>
        <p className="text-2xl font-bold text-red-600">25</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-600">Refunded</p>
        <p className="text-2xl font-bold text-orange-600">5</p>
      </div>
    </div>
  </div>
        )}

        {currentView === 'notifications' && (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h1>
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="font-medium text-gray-900">📦 Your order #1234 has been shipped</p>
        <p className="text-sm text-gray-600">2 hours ago</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="font-medium text-gray-900">💳 Payment received for order #1229</p>
        <p className="text-sm text-gray-600">Yesterday</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="font-medium text-gray-900">🎉 New feature update is available</p>
        <p className="text-sm text-gray-600">2 days ago</p>
      </div>
    </div>
  </div>
        )}

        {currentView === 'settings' && (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600">Name</label>
          <input type="text" value="John Doe" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" readOnly />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <input type="email" value="john@example.com" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" readOnly />
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h2>
      <p className="text-gray-700">Current Plan: <span className="font-medium">Pro</span></p>
      <p className="text-gray-500 text-sm mt-2">Renews on: 12th Oct 2025</p>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Upgrade Plan</button>
    </div>
  </div>
        )}

        {currentView === 'community' && (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Community</h1>

    
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <textarea placeholder="What's on your mind?" className="w-full border rounded-md p-3 text-gray-700"></textarea>
      <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Post</button>
    </div>

    
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="font-medium text-gray-900">🚀 Alex Johnson</p>
        <p className="text-gray-700 mt-2">Just launched my first store on DropShip Pro!</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="font-medium text-gray-900">💡 Sarah Lee</p>
        <p className="text-gray-700 mt-2">Does anyone have tips on increasing store traffic?</p>
      </div>
    </div>
  </div>
        )}

      </main>

      {/* {showProductModal && selectedProduct && (
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
      )} */}

      {showProductModal && (
  <AddProductModal
    onClose={() => {
      setShowProductModal(false);
      setSelectedProduct(null);
    }}
    fetchMyProducts={fetchMyProducts}
    generateWithAI={generateWithAI}
    addToInventory={addToInventory}
    token={token}
    selectedStore={selectedStore}
    selectedProduct={selectedProduct} // can be null for add mode
  />
)}

{viewProductModal && (
  <ViewProduct
    onClose={() => {
      setViewProductModal(false);
      setSelectedProduct(null);
    }}
    fetchMyProducts={fetchMyProducts}
    generateWithAI={generateWithAI}
    addToInventory={addToInventory}
    token={token}
    selectedStore={selectedStore}
    product={selectedProduct} // can be null for add mode
  />
)}


      {showAddProductOptions && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <button 
        onClick={() => { setManualAdd(true); setShowAddProductOptions(false); }} 
        className="w-full bg-blue-600 text-white py-2 rounded mb-3"
      >
        Add Manually
      </button>
      <button 
        onClick={() => { setAiAdd(true); setShowAddProductOptions(false); }} 
        className="w-full bg-purple-600 text-white py-2 rounded"
      >
        Generate with AI
      </button>
      <button 
        onClick={() => setShowAddProductOptions(false)} 
        className="mt-4 text-gray-500"
      >
        Cancel
      </button>
    </div>
  </div>
)}






    </div>
  );
};

const InventoryRow = ({ item, onUpdate, onPublish, generateWithAI }) => {
  console.log("inventory item", item);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    sellingPrice: item.sellingPrice,
    quantity: item.quantity,
    description: item.description
  });

  console.log("edit data", editData);

  // const handleSave = () => {
  //   onUpdate(item.id, editData);
  //   setIsEditing(false);
  // };

  const handleSave = () => {
  const formData = new FormData();
  formData.append("productId", item.productId || item._id);
  formData.append("storeId", item.storeId || item.productId);
  formData.append("name", editData.name);
  formData.append("price", editData.price);
  formData.append("sellingPrice", editData.sellingPrice);
  formData.append("quantity", editData.quantity);
  formData.append("description", editData.description || "this is desc");

  if (editData.imageFile) {
    formData.append("image", editData.imageFile); // actual file
  }
  console.log("item", item);

  onUpdate(item.productId, formData); // pass FormData instead of JSON
  setIsEditing(false);
};


  const handleAIGenerate = (field) => {
    const newValue = generateWithAI(field, editData[field]);
    setEditData({ ...editData, [field]: newValue });
  };

  // if (isEditing) {
  //   return (
  //     <tr className="bg-blue-50">
  //       <td className="px-6 py-4">
  //         <div className="flex items-center">
  //           <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover mr-3" />
  //           <div>
  //             <div className="flex items-center space-x-2">
  //               <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="font-medium text-gray-900 border rounded px-2 py-1 text-sm" />
  //               <button onClick={() => handleAIGenerate('name')} className="text-purple-600 hover:text-purple-800" title="Generate with AI">
  //                 <Wand2 className="h-4 w-4" />
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </td>
  //       <td className="px-6 py-4 text-sm text-gray-900">${item.price}</td>
  //       <td className="px-6 py-4">
  //         <div className="flex items-center space-x-2">
  //           <input type="number" value={editData.sellingPrice} onChange={(e) => setEditData({...editData, sellingPrice: parseFloat(e.target.value)})} className="text-sm border rounded px-2 py-1 w-20" step="0.01" />
  //           <button onClick={() => handleAIGenerate('price')} className="text-purple-600 hover:text-purple-800" title="Generate with AI">
  //             <Wand2 className="h-4 w-4" />
  //           </button>
  //         </div>
  //       </td>
  //       <td className="px-6 py-4">
  //         <input type="number" value={editData.quantity} onChange={(e) => setEditData({...editData, quantity: parseInt(e.target.value)})} className="text-sm border rounded px-2 py-1 w-16" />
  //       </td>
  //       <td className="px-6 py-4">
  //         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
  //           {item.published ? 'Published' : 'Draft'}
  //         </span>
  //       </td>
  //       <td className="px-6 py-4 text-sm font-medium space-x-2">
  //         <button onClick={handleSave} className="text-green-600 hover:text-green-900">
  //           <Check className="h-4 w-4" />
  //         </button>
  //         <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
  //           <X className="h-4 w-4" />
  //         </button>
  //       </td>
  //     </tr>
  //   );
  // }

  if (isEditing) {
  return (
    <tr className="bg-blue-50">
      {/* Product Name + Image Upload */}
      <td className="px-6 py-4">
        <div className="flex items-center">
          {/* <img src={editData.image || item.image} alt="" className="h-12 w-12 rounded-lg object-cover mr-3" /> */}
          <img
            src={editData.imageFile ? URL.createObjectURL(editData.imageFile) : item.image}
            alt=""
            className="h-12 w-12 rounded-lg object-cover mr-3"
          />

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="font-medium text-gray-900 border rounded px-2 py-1 text-sm"
              />
              <button
                onClick={() => handleAIGenerate("name")}
                className="text-purple-600 hover:text-purple-800"
                title="Generate with AI"
              >
                <Wand2 className="h-4 w-4" />
              </button>
            </div>

            {/* Image upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setEditData({ ...editData, imageFile: file });
                }
              }}
              className="text-xs text-gray-500"
            />
          </div>
        </div>
      </td>

      {/* Cost Price */}
      <td className="px-6 py-4">
        <input
          type="number"
          value={editData.price}
          onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
          className="text-sm border rounded px-2 py-1 w-20"
          step="0.01"
        />
      </td>

      {/* Selling Price */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={editData.sellingPrice || editData.price + (editData.price * (30/100))}
            onChange={(e) => setEditData({ ...editData, sellingPrice: parseFloat(e.target.value) })}
            className="text-sm border rounded px-2 py-1 w-20"
            step="0.01"
          />
          <button
            onClick={() => handleAIGenerate("sellingPrice")}
            className="text-purple-600 hover:text-purple-800"
            title="Generate with AI"
          >
            <Wand2 className="h-4 w-4" />
          </button>
        </div>
      </td>

      {/* Quantity */}
      <td className="px-6 py-4">
        <input
          type="number"
          value={editData.quantity || 1}
          onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value) })}
          className="text-sm border rounded px-2 py-1 w-16"
        />
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.published ? "Published" : "Draft"}
        </span>
      </td>

      {/* Save / Cancel */}
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