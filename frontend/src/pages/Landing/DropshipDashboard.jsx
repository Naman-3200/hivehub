import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import { generateWebsiteContent } from "../generateWebsiteContent.jsx";
import Dashboard from "./Dashboard.jsx"; // adjust path if needed



import { 
  Store, Plus, Search, TrendingUp, Calendar, DollarSign, Package, Edit3, Eye, ExternalLink,
  Wand2, ShoppingCart, Star, X, Check, Upload, Globe, Settings, Loader, Copy, Share2, ChevronDown
} from 'lucide-react';
import AddProductModal from '../../components/AddProductModal';
import ViewProduct from '../../components/ViewProduct';

const DropshipDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [stores, setStores] = useState([]);
  const [userId, setUserId] = useState(null);
  const [newArrivals, setNewArrivals] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [allProductsData, setAllProductsData] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
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
  const [productMode, setProductMode] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [genProducts, setGenProducts] = useState([]);

  const navigate = useNavigate();
  
  
  console.log("myproducts:", myProducts);





// const [newProduct, setNewProduct] = useState({
//   name: "",
//   description: "",
//   price: "",
//   image: "",
//   category: "",
// });


const [isEditing, setIsEditing] = useState(false);



  const token = typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;

  



  const handleDelete = async (productId, product) => {
    try {
      console.log("product of the product", product)
      await axios.delete(`https://hivehub-1.onrender.com/api/my-products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyProducts(); // refresh after delete
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };


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
      console.log("data", data);
      const productsList = data?.data?.list ?? data?.list ?? [];
      console.log("Fetched products:", productsList);
      if (!Array.isArray(productsList) || productsList.length === 0) {
        setAllProductsData([]);
        setError("No products returned from API");
        return;
      }

      const mappedProducts = data.data.list.map((item) => {
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
    fetchGenProducts();

    if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserId(decoded.id); // or decoded.userId depending on your backend
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }
  }, []);


 
  // Replace your getProductsByCategory function
const getProductsByCategory = (category) => {
  const productsCopy = [...allProductsData]; // avoid mutating
  switch (category) {
    case 'trending':
  return productsCopy
    .sort((a, b) => b.reviews - a.reviews) // or b.rating - a.rating, or b.sales - a.sales
    .slice(0, 20);
    case 'revenue':
      return productsCopy.sort((a, b) => b.price - a.price).slice(0, 20);
    case 'new':
      return productsCopy.sort((a, b) => b.createTime - a.createTime).slice(0, 20);
    case 'myprod':
      return genProducts;
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


    return `https://hivehub-tr8u.vercel.app/store/${storeId}`;
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


const handleAddGenProduct = (newProduct) => {
  setGenProducts((prev) => [newProduct, ...prev]); // put new product at top
};

const updateInventoryItem = async (productId, formData) => {
  try {
    for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}

    if (token) {
      const res = await fetch(`https://hivehub-1.onrender.com/api/my-products/update`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
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
      const response = await fetch(`https://hivehub-1.onrender.com/api/publish-to-website/${productIds}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ published: true, storeId: (selectedStore?._id || selectedStore.id) })
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





//   const generateWithAI = async (field, currentValue) => {
//   try {
//     const res = await fetch("https://hivehub-1.onrender.com/api/generate-product", {
//       method: "POST",
//       headers: { 
//         'Authorization': `Bearer ${token}`,
//         "Content-Type": "application/json" 
//       },
//       body: JSON.stringify({ field, currentValue }),
//     });

//     const data = await res.json();
//     return data.suggestion || currentValue;
//   } catch (err) {
//     console.error("AI generation failed:", err);
//     return currentValue;
//   }
// };


const generateWithAI = async (field, currentValue, nameValue) => {
  try {
    if (field === "name") {
      // Generate product name
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${"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"}`, // 🔑 use env var
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a product generator." },
            { role: "user", content: `Suggest a unique product name related to ${nameValue}.` }
          ],
        }),
      });
      const data = await res.json();
      return data.choices[0].message.content.trim();
    }

    if (field === "category") {
      // Description should be based on the generated name
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${"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"}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a creative product copywriter." },
            { role: "user", content: `Write a short marketing description for the product called "${nameValue}". Can also mention special features.` }
          ],
        }),
      });
      const data = await res.json();
      return data.choices[0].message.content.trim();
    }

    if (field === "image") {
      // Generate an image for the product name
      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${"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"}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: `High quality product image for ${nameValue}, professional e-commerce style, white background`,
          size: "1024x1024",
        }),
      });
      const data = await res.json();
      console.log("Generated image data:", data);
      return data.data[0].url;
    }

    return currentValue;
  } catch (err) {
    console.error("AI generation failed", err);
    return currentValue;
  }
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


   const fetchGenProducts = async () => {
    try {
      const res = await fetch("https://hivehub-1.onrender.com/api/gen-products");
      const data = await res.json();
    const products = Array.isArray(data) ? data : data.products || [];

      setGenProducts(Array.isArray(data) ? data : data.products || []);
      console.log("Generated products fetched:", products);
    } catch (err) {
      console.error("Failed to fetch gen products:", err);
    }
  };

    useEffect(() => {

  if (stores && stores?.length > 0) {
    const needsUpdate = stores.some(store => !store?.localUrl?.startsWith("blob:"));
    if (!needsUpdate) return; // ✅ Already processed

    const updatedStores = stores.map(store => {
      if (store.localUrl?.startsWith("blob:")) return store;
      const blobUrl = createLocalWebsite(store);
      return { ...store, localUrl: blobUrl };
    });
    setStores(updatedStores);
  }
}, [stores]);


  const openStoreWebsite = (store) => {
  const slug = store.customDomain
    ? store.customDomain.replace(/^https?:\/\//, "")
    : store.domain?.split("/").pop();

  // Open using the slug route
  window.open(`https://hivehub-tr8u.vercel.app/store/${slug}`, "_blank");
};



  const filteredProducts = allProductsData.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentProducts = searchQuery ? filteredProducts : getProductsByCategory(activeTab);

  // const dashboardMetrics = {
  //   totalRevenue: myProducts.reduce((sum, item) => sum + (item.published ? (item.sellingPrice || 0) * 5 : 0), 0),
  //   totalOrders: myProducts.filter(item => item.published).length * 3,
  //   totalProducts: myProducts.filter(item => item.published).length,
  //   storeViews: selectedStore ? 1247 : 0
  // };



  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Hivee Hub</span>
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
        {/* {currentView === 'dashboard' && (
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
        )} */}

        {currentView === "dashboard" && (
          <Dashboard
            stores={stores}
            selectedStore={selectedStore}
            myProducts={myProducts}
            allProductsData={allProductsData}
            loading={loading}
          />
        )}


{console.log("Store data:", stores)}
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
                {stores.map((store) => (
                  <div
                    key={store?.id}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{store?.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{store?.category}</p>
                      </div>
                      <button
                        onClick={() => openStoreWebsite(store)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Store Domain + Copy + Share */}
                    
                    <div className="mb-4">
  <p className="text-sm text-gray-800 font-medium truncate">
    {store?.customDomain || store?.domain}
  </p>
  <div className="flex gap-2 mt-2">
    {/* Copy button */}
    <button
      onClick={() => {
        const copyUrl = (store?.customDomain || store.domain).startsWith("http")
          ? (store?.customDomain || store.domain)
          : `${window.location.origin}/${(store?.customDomain || store.domain).domain.replace(/^\//, "")}`;

        navigator.clipboard
          .writeText(copyUrl)
          .then(() => alert("Copied to clipboard!"))
          .catch(() => alert("Failed to copy"));
      }}
      className="flex items-center text-xs text-gray-600 hover:text-gray-900"
    >
      <Copy className="h-4 w-4 mr-1" />
      Copy
    </button>
    <button onClick={() => navigate(`/builder/${store._id}`, {
      state: { store, publishedProducts: myProducts.filter(p => p.published) }
    })
    }
    >
      Edit Store</button>
{/* <Button onClick={() => window.open(`https://${store.domain}`, "_blank")}>View Store</Button> */}


    {/* Share button */}
    <button
      onClick={() => {
        if (navigator.share) {
          const shareUrl = store.domain.startsWith("http")
            ? store?.domain
            : `${window.location.origin}/${store?.domain.replace(/^\//, "")}`;

          navigator
            .share({
              title: store?.name || "My Store",
              url: shareUrl,
            })
            .catch((err) => console.error("Share failed:", err));
        } else {
          alert("Sharing not supported on this device");
        }
      }}
      className="flex items-center text-xs text-gray-600 hover:text-gray-900"
    >
      <Share2 className="h-4 w-4 mr-1" />
      Share
    </button>
    <button
    onClick={() => {
      const newDomain = prompt("Enter your custom domain:", store?.customDomain || "");
      if (newDomain) {
        fetch(`https://hivehub-1.onrender.com/api/stores/${store?._id}/domain`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ customDomain: newDomain }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setStores((prev) =>
                prev.map((s) =>
                  s._id === store._id ? data.store : s
                )
              );
            } else {
              alert(data.error || "Failed to update domain");
            }
          });
      }
    }}
    className="ml-2 text-xs text-blue-600 hover:text-blue-900"
  >
    Edit Domain
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
   

    <div className="relative inline-block text-left">


 <button
    onClick={() => setOpenDropdown((prev) => !prev)}
    className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
  >
    + Add Product
    <ChevronDown className="ml-2 w-4 h-4" />
  </button>

 

  {openDropdown && (
    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-50">
      <button
        onClick={() => {
          setProductMode("manual");
          setShowProductModal(true);
          setOpenDropdown(false);
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
      >
        Manual
      </button>
      <button
        onClick={() => {
          setProductMode("ai");
          setShowProductModal(true);
          setOpenDropdown(false);
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
      >
        AI
      </button>
    </div>
  )}
</div>

   

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
              { id: "trending", label: "Trending", icon: TrendingUp },
              { id: "revenue", label: "Revenue Based", icon: DollarSign },
              { id: "new", label: "New Arrivals", icon: Calendar },
              { id: "myprod", label: "My Products", icon: Calendar },

            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
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


      {activeTab === "myprod" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {newArrivals.filter((p) => p.userId === userId).length === 0 ? (
      <p className="text-gray-500">You haven’t added any products yet.</p>
    ) : (
     newArrivals
        .filter((p) => p.userId === userId) // ✅ only your products
        .map((product) => (
        <div
          key={product._id}
          className="bg-white border rounded-lg shadow hover:shadow-md transition p-4"
        >
          {/* Image(s) - bigger than other tabs */}
          {Array.isArray(product.image) ? (
            <div className="flex gap-2 overflow-x-auto">
              {product.image.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={product.name}
                  className="h-56 w-full object-cover rounded"
                />
              ))}
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className="h-64 w-full object-cover rounded mb-2"
            />
          )}

          {/* Info */}
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
          <p className="mt-1 text-gray-700 text-sm line-clamp-2">
            {product.description}
          </p>

          {/* Prices */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-gray-900 font-bold">
              ${product.sellingPrice}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          </div>

          {/* Profit */}
          <p className="text-green-600 text-sm mt-1">
            Profit: ${product.potentialProfit}
          </p>
        </div>
      ))
    )}
  </div>
)}


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
              {/* Select Store Dropdown */}
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Stores</option>
                {stores.map((store) => (
                  <option key={store._id} value={store._id}>
                    {store.name}
                  </option>
                ))}
              </select>
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
                      {/* {myProducts.map(item => (
                        <InventoryRow key={item._id || item.productId} item={item} onDelete={handleDelete} onUpdate={updateInventoryItem} onPublish={() => publishProduct(item)} generateWithAI={generateWithAI} />
                      ))} */}
                      {myProducts
                        .filter(item => !selectedStore || item.storeId === selectedStore)
                        .map(item => (
                          <InventoryRow
                            key={item._id || item.productId}
                            item={item}
                            onDelete={handleDelete}
                            onUpdate={updateInventoryItem}
                            onPublish={() => publishProduct(item)}
                            generateWithAI={generateWithAI}
                          />
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

        {/* {currentView === 'community' && (
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
        )} */}

        {currentView === 'community' && <Community />}


      </main>

      

      {showProductModal && (
  <AddProductModal
    onClose={() => {
      setShowProductModal(false);
      setSelectedProduct(null);
    }}
    onAddGenProduct={handleAddGenProduct}
    fetchGenProducts={fetchGenProducts}
    fetchMyProducts={fetchMyProducts}
    generateWithAI={generateWithAI}
    addToInventory={addToInventory}
    token={token}
    selectedStore={selectedStore}
    selectedProduct={selectedProduct} 
    isEditing={isEditing}
    productMode={productMode}   

  />
)}

{viewProductModal && (
  <ViewProduct
    onClose={() => {
      setViewProductModal(false);
      setSelectedProduct(null);
    }}
    fetchMyProducts={fetchMyProducts}
    genProducts={genProducts}
    fetchGenProducts={fetchGenProducts}
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

import EditInventoryModal from "./EditInventoryModal";
import Community from './Community.jsx';
const InventoryRow = ({ item, onUpdate, onPublish, generateWithAI, onDelete }) => {
  console.log("inventory item", item);

  const [showModal, setShowModal] = useState(false);
  

  return (
    <>
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
          {item.published ? 'Published' : 'Unpublished'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button onClick={() => setShowModal(true)} className="text-blue-600 hover:text-blue-900">
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
        <button
          onClick={() => onDelete(item.productId, item)}  // ✅ use onDelete
          className="text-red-600 hover:text-red-900"
          title="Delete product"
        >
          <X className="h-4 w-4" />
        </button>
      </td>
    </tr>
    {showModal && (
        <EditInventoryModal
          item={item}
          onUpdate={onUpdate}
          generateWithAI={generateWithAI}
          onClose={() => setShowModal(false)}
        />
      )}
      </>
  );
};

export default DropshipDashboard;