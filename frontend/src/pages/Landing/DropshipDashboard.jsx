import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import { generateWebsiteContent } from "../generateWebsiteContent.jsx";
import Dashboard from "./Dashboard.jsx"; // adjust path if needed
import { createWhopCheckout } from '../../utils/subscriptionService.js';
import StoresPage from '../StoresPage.jsx';



import { 
  Store, Plus, Search, TrendingUp, Calendar, DollarSign, Package, Edit3, Eye, ExternalLink,
  Wand2, ShoppingCart, Star, X, Check, Upload, Globe, Settings, Loader, Copy, Share2, ChevronDown, StoreIcon
} from 'lucide-react';
import AddProductModal from '../../components/AddProductModal';
import ViewProduct from '../../components/ViewProduct';
  import { getNotifications, markAllAsRead } from "../../utils/notificationService.js";
  import { AuthContext } from "../../context/authContext.jsx";
  import { getUserProfile, updateUserProfile } from "../../utils/userService.js";




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
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [viewProductModal, setViewProductModal] = useState(false);
  const [error, setError] = useState(null);
  const [showAddProductOptions, setShowAddProductOptions] = useState(false);
  const [manualAdd, setManualAdd] = useState(false);
  const [aiAdd, setAiAdd] = useState(false);
  const [productMode, setProductMode] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [genProducts, setGenProducts] = useState([]);
const [notifications, setNotifications] = useState([]);
const [loadingNotifications, setLoadingNotifications] = useState(true);
const { user } = useContext(AuthContext);
const [userData, setUserData] = useState(null);
// const [loading, setLoading] = useState(true);
const [formData, setFormData] = useState({ name: "", profilePicture: "" });

  const navigate = useNavigate();

   const token = typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;
  
  
  console.log("myproducts:", myProducts);

  const fetchUserProfile = async () => {
  setLoading(true);
  try {
    const data = await getUserProfile(token);
    if (data.success) {
      setUserData(data.user);
      setFormData({
        name: data.user.name,
        profilePicture: data.user.profilePicture || "",
      });
    }
    console.log("Fetched user profile:", data);
  } catch (err) {
    console.error("Error fetching user data:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  if (currentView === "settings") fetchUserProfile();
}, [currentView]);

// useEffect(() => {
//   fetchUserProfile();
// }, []);



const handleSaveProfile = async () => {
  try {
    const data = await updateUserProfile(token, formData);
    if (data.success) {
      alert("Profile updated successfully!");
      setUserData(data.user);
    } else {
      alert(data.message || "Failed to update profile");
    }
  } catch (err) {
    console.error("Error updating profile:", err);
  }
};




// const [newProduct, setNewProduct] = useState({
//   name: "",
//   description: "",
//   price: "",
//   image: "",
//   category: "",
// });


const [isEditing, setIsEditing] = useState(false);



 

  const handleUpgradePlan = async () => {
  try {
    const selectedPlanId = "plan_2nmlTo9tmKpBF"; // 🔁 replace with actual Whop product ID
    const response = await createWhopCheckout(token, selectedPlanId);
    if (response.success && response.checkoutUrl) {
      window.location.href = response.checkoutUrl; // redirect to Whop checkout
    } else {
      alert(response.message || "Unable to start checkout");
    }
  } catch (err) {
    console.error("Upgrade plan error:", err);
    alert("Something went wrong while redirecting to Whop");
  }
};



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


useEffect(() => {
  if (currentView === "notifications" && user?._id) {
    fetchNotifications();
  }
}, [currentView]);

const fetchNotifications = async () => {
  setLoadingNotifications(true);
  try {
    const data = await getNotifications(user._id);
    if (data.success) setNotifications(data.notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
  } finally {
    setLoadingNotifications(false);
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


  // Make sure this import exists at the top of DropshipDashboard.jsx
// import { generateWebsiteContent } from "../generateWebsiteContent.jsx";

const refreshStorePreview = async (storeId) => {
  if (!storeId) return null;
  try {
    console.log("🔄 refreshStorePreview for store:", storeId);

    const resp = await fetch(`https://hivehub-1.onrender.com/api/web-products/${storeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await resp.json();
    console.log("📦 /api/web-products response:", data);

    if (!data?.success) {
      console.warn("⚠️ web-products returned non-success for", storeId, data);
      return null;
    }

    const { store, products } = data;
    console.log(
      `✅ Building HTML for "${store?.name}" with ${products?.length ?? 0} products`
    );

    const html = generateWebsiteContent(store, products || []);
    const blobUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));

    // persist the blob url on the store in state, so View Live Store reuses it
    setStores((prev) =>
      prev.map((s) =>
        String(s._id || s.id) === String(storeId) ? { ...s, localUrl: blobUrl } : s
      )
    );

    return blobUrl;
  } catch (err) {
    console.error("❌ refreshStorePreview failed:", err);
    return null;
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
      console.log("dsata data data",data)
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
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          storeId: selectedStore?._id,
          published: true  

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



async function regenerateLocalSiteFromServer(storeId) {
  try {
    const resp = await fetch(`https://hivehub-1.onrender.com/api/stores/${storeId}/html`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) {
      console.error(`❌ Failed to regenerate site for store ${storeId}`, await resp.text());
      return;
    }

    const html = await resp.text();
    const blobUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));

    setStores((prev) =>
      prev.map((s) =>
        String(s._id || s.id) === String(storeId) ? { ...s, localUrl: blobUrl } : s
      )
    );

    setSelectedStore((prev) =>
      prev && String(prev._id || prev.id) === String(storeId)
        ? { ...prev, localUrl: blobUrl }
        : prev
    );

    console.log(`✅ Storefront regenerated for ${storeId}`);
  } catch (err) {
    console.error(`❌ Error regenerating site for store ${storeId}`, err);
  }
}







const publishProduct = async (item) => {
  try {
    const storeId = selectedStore || item.storeId; // selectedStore is the ID from the <select>
    if (!storeId) {
      alert("Select a store first");
      return;
    }

    const productId = item.productId || item.id;
    const resp = await fetch(`https://hivehub-1.onrender.com/api/publish-to-website/${productId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ published: true, storeId })
    });

    if (!resp.ok) {
      const e = await resp.json().catch(() => ({}));
      console.error("Publish failed:", e);
      alert(e?.message || "Publish failed");
      return;
    }

    await fetchMyProducts(); // refresh table

    // 🔁 Rebuild storefront HTML from server's canonical list
    await regenerateLocalSiteFromServer(storeId);
  } catch (e) {
    console.error("publishProduct error:", e);
  }
};




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
      console.log("Generated name data:", data);
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


const createLocalWebsite = (storeObj) => {
  if (!storeObj) return null;

  const publishedProducts = (myProducts || []).filter(
    (p) => p.published && String(p.storeId) === String(storeObj._id || storeObj.id)
  );

  const websiteContent = generateWebsiteContent(storeObj, publishedProducts);
  const blob = new Blob([websiteContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  setStores((prev) =>
    prev.map((s) =>
      String(s._id || s.id) === String(storeObj._id || storeObj.id)
        ? { ...s, localUrl: url }
        : s
    )
  );

  setSelectedStore((prev) =>
    prev && String(prev._id || prev.id) === String(storeObj._id || storeObj.id)
      ? { ...prev, localUrl: url }
      : prev
  );

  console.log(`🧩 Rebuilt local website for store ${storeObj.name}`);
  return url;
};



useEffect(() => {
  // Make global update function accessible for modals
  window.updateStoreLocalUrl = (storeId, blobUrl) => {
    setStores((prev) =>
      prev.map((s) =>
        String(s._id || s.id) === String(storeId)
          ? { ...s, localUrl: blobUrl }
          : s
      )
    );
    console.log(`🌐 Updated localUrl for store ${storeId}`);
  };

  return () => {
    window.updateStoreLocalUrl = null;
  };
}, []);





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
  if (!Array.isArray(stores) || stores.length === 0) return;

  const needsUpdate = stores.some((store) => {
    const lu = store?.localUrl;
    return !(typeof lu === "string" && lu.startsWith("blob:"));
  });
  if (!needsUpdate) return;

  const updated = stores.map((store) => {
    const lu = store?.localUrl;
    if (typeof lu === "string" && lu.startsWith("blob:")) return store;
    const blobUrl = createLocalWebsite(store);
    return { ...store, localUrl: blobUrl };
  });
  setStores(updated);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [stores, myProducts]);



const openStoreWebsite = async (storeIdOrObj) => {
  const storeObj =
    typeof storeIdOrObj === "object"
      ? storeIdOrObj
      : stores.find((s) => String(s._id || s.id) === String(storeIdOrObj));

  if (!storeObj) {
    alert("Store not found");
    return;
  }

  const id = String(storeObj._id || storeObj.id);
  // always rebuild from WebProduct before opening
  const freshUrl = await refreshStorePreview(id);

  // use the freshly built url if available, fallback to any existing localUrl
  const url =
    freshUrl ||
    stores.find((s) => String(s._id || s.id) === id)?.localUrl ||
    storeObj.localUrl;

  if (!url) {
    alert("Could not build the storefront. Please try again.");
    return;
  }

  window.open(url, "_blank");
};



const filteredProducts = allProductsData.filter(product =>
  product.name.toLowerCase().includes(searchQuery.toLowerCase())
);

const currentProducts = searchQuery ? filteredProducts : getProductsByCategory(activeTab);



//   return (
//     <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08)_0%,rgba(99,102,241,0.06)_35%,transparent_60%)]">
    
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    

 
//     <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08)_0%,rgba(99,102,241,0.06)_35%,transparent_60%)]">
//       {/* Sticky/blurred header */}
//       {/* <header className="sticky top-0 z-40 border-b border-slate-200/60 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90">
//         <div className="h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500" />

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex h-16 items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
//                 {typeof StoreIcon === 'function' ? (
//                   <StoreIcon className="h-5 w-5 text-white" />
//                 ) : (
//                   <div className="h-5 w-5 rounded-sm bg-white/90" />
//                 )}
//               </div>
//               <span className="text-xl font-extrabold tracking-tight text-slate-900">
//                 Hivee{' '}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Hub</span>
//               </span>
//             </div>

//             <nav className="relative flex items-center gap-1 p-1 rounded-2xl bg-slate-100/70 border border-slate-200 shadow-sm">
//               {[
//                 { id: 'dashboard', label: 'Dashboard' },
//                 { id: 'stores', label: 'Stores' },
//                 { id: 'products', label: 'Products' },
//                 { id: 'inventory', label: 'Inventory' },
//                 { id: 'notifications', label: 'Notifications' },
//                 { id: 'settings', label: 'Settings' },
//                 { id: 'community', label: 'Community' },
//               ].map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setCurrentView && setCurrentView(tab.id)}
//                   className={
//                     `px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 ` +
//                     (currentView === tab.id
//                       ? 'bg-white shadow text-blue-700'
//                       : 'text-slate-600 hover:text-slate-900 hover:bg-white')
//                   }
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>
//       </header> */}

//       <Navbar setCurrentView={setCurrentView} />

 
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         {currentView === 'dashboard' && Dashboard && (
//           <Dashboard
//             stores={stores}
//             selectedStore={selectedStore}
//             myProducts={myProducts}
//             allProductsData={allProductsData}
//             loading={loading}
//           />
//         )}

//         <div className="min-h-[60vh] w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden">
//           <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-200 to-blue-100 blur-3xl opacity-60" />

//           <div className="flex-1 px-6 sm:px-8 md:px-10 py-10 relative z-10">
//             {/* {currentView === 'stores' && (
//               <div className="max-w-7xl mx-auto">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
//                   <div>
//                     <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
//                       Your Stores
//                     </h1>
//                     <p className="text-slate-600 text-base sm:text-lg">Create, customize, and manage your online stores beautifully</p>
//                   </div>
//                   <button
//                     onClick={() => setCurrentView && setCurrentView('create-store')}
//                     className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all"
//                   >
//                     <Plus className="h-5 w-5" />
//                     <span className="font-medium">Create Store</span>
//                   </button>
//                 </div>

//                 {(!stores || stores.length === 0) ? (
//                   <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-10 sm:p-16 rounded-3xl shadow-xl text-center">
//                     <StoreIcon className="h-16 w-16 sm:h-20 sm:w-20 text-blue-500 mx-auto mb-6" />
//                     <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">No Stores Yet</h2>
//                     <p className="text-slate-600 mb-8 text-base sm:text-lg">
//                       You haven’t created any stores yet. Start your online journey now!
//                     </p>
//                     <button
//                       onClick={() => setCurrentView && setCurrentView('create-store')}
//                       className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
//                     >
//                       Create Your First Store
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
//                     {stores.map((store, index) => (
//                       <div
//                         key={store?.id || store?._id || index}
//                         className="group bg-white/70 backdrop-blur-lg p-6 rounded-2xl border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
//                       >
//                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//                         <div className="flex justify-between items-start mb-5">
//                           <div>
//                             <h3 className="text-lg sm:text-xl font-semibold text-slate-900 line-clamp-1">{store?.name}</h3>
//                             <p className="text-xs sm:text-sm text-slate-500 capitalize line-clamp-1">{store?.category}</p>
//                           </div>
//                           <button
//                             onClick={() => openStoreWebsite && openStoreWebsite(store)}
//                             className="text-indigo-600 hover:text-indigo-800 transition"
//                             aria-label="Open store website"
//                           >
//                             <ExternalLink className="h-5 w-5" />
//                           </button>
//                         </div>

//                         <div className="mb-6 bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
//                           <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">
//                             {store?.customDomain || store?.domain}
//                           </p>

//                           <div className="flex flex-wrap gap-3 mt-3">
//                             <button
//                               onClick={() => {
//                                 const raw = store?.customDomain || store?.domain || '';
//                                 const copyUrl = raw.startsWith('http')
//                                   ? raw
//                                   : `${window.location.origin}/${String(raw).replace(/^\//, '')}`;
//                                 navigator.clipboard.writeText(copyUrl)
//                                   .then(() => alert('Copied to clipboard!'))
//                                   .catch(() => alert('Failed to copy'));
//                               }}
//                               className="flex items-center text-xs text-slate-600 hover:text-slate-900 transition"
//                             >
//                               <Copy className="h-4 w-4 mr-1" />
//                               Copy
//                             </button>

//                             <button
//                               onClick={() => navigate && navigate(`/builder/${store?._id}` , {
//                                 state: { store, publishedProducts: (myProducts || []).filter(p => p?.published) }
//                               })}
//                               className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
//                             >
//                               Edit Store
//                             </button>

//                             <button
//                               onClick={() => {
//                                 if (navigator.share) {
//                                   const raw = store?.domain || '';
//                                   const shareUrl = raw.startsWith('http')
//                                     ? raw
//                                     : `${window.location.origin}/${String(raw).replace(/^\//, '')}`;
//                                   navigator.share({ title: store?.name || 'My Store', url: shareUrl });
//                                 } else {
//                                   alert('Sharing not supported on this device');
//                                 }
//                               }}
//                               className="flex items-center text-xs text-slate-600 hover:text-slate-900 transition"
//                             >
//                               <Share2 className="h-4 w-4 mr-1" />
//                               Share
//                             </button>

//                             <button
//                               onClick={() => {
//                                 const current = store?.customDomain || '';
//                                 const newDomain = prompt('Enter your custom domain:', current);
//                                 if (newDomain) {
//                                   fetch(`https://hivehub-1.onrender.com/api/stores/${store?._id}/domain`, {
//                                     method: 'PUT',
//                                     headers: {
//                                       'Content-Type': 'application/json',
//                                       Authorization: token ? `Bearer ${token}` : undefined,
//                                     },
//                                     body: JSON.stringify({ customDomain: newDomain }),
//                                   })
//                                     .then((res) => res.json())
//                                     .then((data) => {
//                                       if (data?.success) {
//                                         setStores && setStores((prev) => prev.map((s) => (s?._id === store?._id ? data.store : s)));
//                                       } else {
//                                         alert(data?.error || 'Failed to update domain');
//                                       }
//                                     })
//                                     .catch(() => alert('Failed to update domain'));
//                                 }
//                               }}
//                               className="text-xs text-indigo-600 hover:text-indigo-900 transition"
//                             >
//                               Edit Domain
//                             </button>
//                           </div>
//                         </div>

//                         <div className="flex justify-between items-center pt-3 border-t border-slate-200">
//                           <button
//                             onClick={() => openStoreWebsite && openStoreWebsite(store)}
//                             className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
//                           >
//                             <Globe className="h-4 w-4" />
//                             View Live Store
//                           </button>
//                           <button
//                             onClick={() => {
//                               setSelectedStore && setSelectedStore(store);
//                               setCurrentView && setCurrentView('inventory');
//                             }}
//                             className="text-sm text-slate-700 hover:text-slate-900 font-medium transition"
//                           >
//                             Manage
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )} */}

//             {currentView === "stores" && (
//   <StoresPage
//      stores={stores}
//      setStores={setStores}
//      newStore={newStore}
//      setNewStore={setNewStore}
//      storeCategories={storeCategories}
//      createStore={createStore}
//      selectedStore={selectedStore}
//      setSelectedStore={setSelectedStore}
//      openStoreWebsite={openStoreWebsite}
//      myProducts={myProducts}
//      navigate={navigate}
//      token={token}
//      setCurrentView={setCurrentView}
//   />
// )}


//             {/* {currentView === 'create-store' && (
//               <div className="max-w-3xl sm:max-w-4xl mx-auto">
//                 <div className="mb-10 sm:mb-12 text-center">
//                   <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
//                     Create a New Store
//                   </h1>
//                   <p className="text-slate-600 text-base sm:text-lg">Set up your online store in just a few elegant steps</p>
//                 </div>

//                 <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200">
//                   <div className="space-y-8 sm:space-y-10">
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">Store Name</label>
//                       <input
//                         type="text"
//                         value={newStore?.name || ''}
//                         onChange={(e) => setNewStore && setNewStore({ ...newStore, name: e.target.value })}
//                         placeholder="Enter your store name"
//                         className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-3">What do you want to sell?</label>
//                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
//                         {(storeCategories || []).map((category) => (
//                           <button
//                             type="button"
//                             key={category.id}
//                             onClick={() => setNewStore && setNewStore({ ...newStore, category: category.id })}
//                             className={`p-5 sm:p-6 rounded-xl text-center border transition-all transform hover:scale-[1.02] ${
//                               newStore?.category === category.id
//                                 ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
//                                 : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
//                             }`}
//                           >
//                             <div className="text-2xl sm:text-3xl mb-2">{category.icon}</div>
//                             <div className="text-sm font-medium">{category.name}</div>
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-2">
//                       <button
//                         type="button"
//                         onClick={() => setCurrentView && setCurrentView('stores')}
//                         className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="button"
//                         onClick={createStore}
//                         disabled={!newStore?.name || !newStore?.category}
//                         className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                       >
//                         Generate Website
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )} */}

//             {currentView === "create-store" && (
//   <CreateStorePage
//     newStore={newStore}
//     setNewStore={setNewStore}
//     storeCategories={storeCategories}
//     createStore={createStore}
//     navigate={navigate}
//   />
// )}

//           </div>
//         </div>
//       </main>
//     </div>



          


//         {/* {currentView === 'products' && (
//   <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col px-8 py-10">
//     <div className="flex justify-between items-center mb-10 max-w-7xl mx-auto w-full">
//       <div>
//         <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">🛍️ Products</h1>
//         <p className="text-gray-600 text-sm mt-1">
//           {selectedStore
//             ? `Add products to ${selectedStore.name}`
//             : 'Select a store to manage its inventory'}
//         </p>
//       </div>

//       <div className="relative inline-block text-left">
//         <button
//           onClick={() => setOpenDropdown((prev) => !prev)}
//           className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
//         >
//           <span className="font-medium">+ Add Product</span>
//           <ChevronDown className="ml-2 w-4 h-4" />
//         </button>

//         {openDropdown && (
//           <div className="absolute right-0 mt-2 w-44 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 z-50 animate-fadeIn">
//             <button
//               onClick={() => {
//                 setProductMode('manual');
//                 setShowProductModal(true);
//                 setOpenDropdown(false);
//               }}
//               className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-t-xl transition-colors"
//             >
//               ✏️ Manual
//             </button>
//             <button
//               onClick={() => {
//                 setProductMode('ai');
//                 setShowProductModal(true);
//                 setOpenDropdown(false);
//               }}
//               className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-b-xl transition-colors"
//             >
//               🤖 AI
//             </button>
//           </div>
//         )}
//       </div>
//     </div>

//     <div className="bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg rounded-2xl p-5 max-w-7xl mx-auto mb-10">
//       <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
//         <div className="flex flex-wrap gap-3">
//           {[
//             { id: 'trending', label: 'Trending', icon: TrendingUp },
//             { id: 'revenue', label: 'Revenue Based', icon: DollarSign },
//             { id: 'new', label: 'New Arrivals', icon: Calendar },
//             { id: 'myprod', label: 'My Products', icon: Calendar },
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
//                 activeTab === tab.id
//                   ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
//                   : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
//               }`}
//             >
//               <tab.icon className="h-4 w-4 mr-2" />
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         <div className="relative">
//           <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
//           />
//         </div>
//       </div>
//     </div>

//     {activeTab === 'myprod' && (
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//         {newArrivals.filter((p) => p.userId === userId).length === 0 ? (
//           <p className="text-gray-500 col-span-full text-center py-12 bg-white/60 rounded-xl shadow">
//             You haven’t added any products yet.
//           </p>
//         ) : (
//           newArrivals
//             .filter((p) => p.userId === userId)
//             .map((product) => (
//               <div
//                 key={product._id}
//                 className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
//               >
//                 <img
//                   src={Array.isArray(product.image) ? product.image[0] : product.image}
//                   alt={product.name}
//                   className="h-56 w-full object-cover"
//                 />
//                 <div className="p-5">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
//                   <p className="text-sm text-gray-500 mb-2">{product.category}</p>
//                   <p className="text-gray-700 text-sm line-clamp-2">{product.description}</p>

//                   <div className="flex justify-between items-center mt-4">
//                     <span className="text-lg font-bold text-gray-900">${product.sellingPrice}</span>
//                     <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
//                   </div>
//                   <p className="text-green-600 text-sm mt-1">Profit: ${product.potentialProfit}</p>
//                 </div>
//               </div>
//             ))
//         )}
//       </div>
//     )}

//     {loading ? (
//       <div className="flex justify-center items-center py-16 text-gray-600">
//         <Loader className="h-8 w-8 animate-spin text-blue-600 mr-3" />
//         Loading products...
//       </div>
//     ) : error ? (
//       <div className="text-center py-12">
//         <div className="text-red-500 font-semibold mb-4">⚠️ Error loading products</div>
//         <p className="text-gray-600 mb-4">{error}</p>
//         <button
//           onClick={() => fetchProducts()}
//           className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
//         >
//           Retry
//         </button>
//       </div>
//     ) : (
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//         {currentProducts.map((product) => (
//           <div
//             key={product.id}
//             className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
//           >
//             <img
//               src={product.image}
//               alt={product.name}
//               className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
//             />
//             <div className="p-5">
//               <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

//               <div className="flex items-center mb-3">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-4 w-4 ${
//                       i < Math.floor(product.rating)
//                         ? 'text-yellow-400 fill-current'
//                         : 'text-gray-300'
//                     }`}
//                   />
//                 ))}
//                 <span className="ml-2 text-sm text-gray-500">({product.reviews})</span>
//               </div>

//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <span className="text-lg font-bold text-gray-900">${product.price}</span>
//                   <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice}</span>
//                 </div>
//               </div>

//               <button
//                 onClick={() => {
//                   setSelectedProduct(product);
//                   setIsEditing(false);
//                   setViewProductModal(true);
//                 }}
//                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow hover:shadow-lg transition-all"
//               >
//                 View Details
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
//         )} */}

//         {currentView === "products" && (
//   <ProductsPage
//     activeTab={activeTab}
//     setActiveTab={setActiveTab}
//     searchQuery={searchQuery}
//     setSearchQuery={setSearchQuery}
//     currentProducts={getProductsByCategory(activeTab)}
//     loading={loading}
//     error={error}
//     fetchProducts={fetchProducts}
//     selectedStore={selectedStore}

//     // Modals & actions
//     openDropdown={openDropdown}
//     setOpenDropdown={setOpenDropdown}
//     setShowProductModal={setShowProductModal}
//     setProductMode={setProductMode}
//     setSelectedProduct={setSelectedProduct}
//     setIsEditing={setIsEditing}
//     setViewProductModal={setViewProductModal}

//     // User-specific product list
//     userId={userId}
//     newArrivals={newArrivals}
//   />
// )}



//         {currentView === 'inventory' && (
//   <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8 rounded-2xl shadow-inner">
//     {/* Header */}
//     <div className="flex flex-wrap justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-md border border-gray-100 backdrop-blur-sm">
//       <div>
//         <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">🧾 Inventory</h1>
//         <p className="text-gray-500 mt-1">Manage your products, pricing, and store availability</p>
//       </div>

//       <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
//         {/* Store Filter */}
//         <select
//           value={selectedStore}
//           onChange={(e) => setSelectedStore(e.target.value)}
//           className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-700 hover:bg-white shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
//         >
//           <option value="">All Stores</option>
//           {stores.map((store) => (
//             <option key={store._id} value={store._id}>
//               {store.name}
//             </option>
//           ))}
//         </select>

//         {/* Add Product Button */}
//         <button
//           onClick={() => setCurrentView('products')}
//           className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
//         >
//           <Plus className="h-5 w-5 mr-2" />
//           Add Products
//         </button>
//       </div>
//     </div>

//     {/* Empty State */}
//     {myProducts.length === 0 ? (
//       <div className="bg-white p-16 rounded-2xl shadow-lg text-center border border-gray-100">
//         <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
//         <h2 className="text-2xl font-semibold text-gray-900 mb-2">No products in inventory</h2>
//         <p className="text-gray-500 mb-6">Add products from our catalog to start selling.</p>
//         <button
//           onClick={() => setCurrentView('products')}
//           className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
//         >
//           Browse Products
//         </button>
//       </div>
//     ) : (
//       /* Table Section */
//       <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//               <tr>
//                 {['Product', 'Cost Price', 'Selling Price', 'Quantity', 'Status', 'Actions'].map((header) => (
//                   <th
//                     key={header}
//                     className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-100">
//               {myProducts
//                 .filter((item) => !selectedStore || item.storeId === selectedStore)
//                 .map((item) => (
//                   <InventoryRow
//                     key={item._id || item.productId}
//                     item={item}
//                     onDelete={handleDelete}
//                     onUpdate={updateInventoryItem}
//                     onPublish={() => publishProduct(item)}
//                     generateWithAI={generateWithAI}
//                   />
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     )}

//     {/* Store Live Notification */}
//     {selectedStore && myProducts.some((item) => item.published && item.storeId === selectedStore.id) && (
//       <div className="mt-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 border border-blue-200 rounded-2xl p-8 shadow-inner">
//         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//           <div>
//             <h3 className="text-xl font-semibold text-blue-900 mb-2">🎉 Your Store is Live!</h3>
//             <p className="text-blue-800 mb-1">
//               Your store "<strong>{selectedStore.name}</strong>" is live with{' '}
//               {myProducts.filter((item) => item.published && item.storeId === selectedStore.id).length} products!
//             </p>
//             <p className="text-blue-600 text-sm">Click below to open your live storefront →</p>
//           </div>
//           <button
//             // onClick={() => openStoreWebsite(selectedStore)}
//             onClick={() => openStoreWebsite(selectedStore?._id || selectedStore?.id || selectedStore)}
//             className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
//           >
//             <Globe className="h-5 w-5 mr-2" />
//             Open Live Store
//           </button>
//         </div>
//       </div>
//     )}
//   </div>
//         )}

        

//         {/* {currentView === 'notifications' && (
//   <div className="min-h-screen bg-gray-50 px-6 py-10">
//     <div className="flex justify-between items-center mb-6">
//       <h1 className="text-3xl font-bold text-gray-900">🔔 Notifications</h1>
//       <button
//         onClick={() => {
//           markAllAsRead(user._id);
//           setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
//         }}
//         className="text-sm text-blue-600 hover:text-blue-800 underline"
//       >
//         Mark all as read
//       </button>
//     </div>

//     {loadingNotifications ? (
//       <p className="text-gray-500 text-center">Loading...</p>
//     ) : notifications.length === 0 ? (
//       <p className="text-gray-500 text-center">No notifications yet 📭</p>
//     ) : (
//       <div className="space-y-4">
//         {notifications.map((n) => (
//           <div
//             key={n._id}
//             className={`bg-white p-4 rounded-xl shadow transition-all ${
//               n.isRead ? "opacity-80" : "border-l-4 border-indigo-500"
//             }`}
//           >
//             <p className="font-medium text-gray-900 flex items-center gap-2">
//               {n.icon || "🔔"} {n.message}
//             </p>
//             <p className="text-sm text-gray-600">
//               {new Date(n.createdAt).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
//         )} */}

//         {currentView === "notifications" && (
//         <NotificationsPage
//           user={user}
//           notifications={notifications}
//           setNotifications={setNotifications}
//           loadingNotifications={loadingNotifications}
//         />
//       )}

//         {currentView === "settings" && (
//         <SettingsPage
//           loading={loading}
//           formData={formData}
//           setFormData={setFormData}
//           userData={userData}
//           handleSaveProfile={handleSaveProfile}
//           handleUpgradePlan={handleUpgradePlan}
//         />
//       )}



//         {/* {currentView === 'settings' && (
//   <div className="min-h-screen bg-gray-50 px-6 py-10">
//     <h1 className="text-3xl font-bold text-gray-900 mb-6">⚙️ Settings</h1>

//     {loading ? (
//       <p className="text-gray-600 text-center">Loading your profile...</p>
//     ) : (
//       <>
//         <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-xl">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>

//           <div className="space-y-5">
//             <div className="text-center">
//               <img
//                 src={
//                   formData.profilePicture ||
//                   "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                 }
//                 alt="Profile"
//                 className="w-24 h-24 rounded-full mx-auto border mb-3"
//               />
//               <input
//                 type="text"
//                 value={formData.profilePicture}
//                 onChange={(e) =>
//                   setFormData({ ...formData, profilePicture: e.target.value })
//                 }
//                 placeholder="Profile picture URL"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-sm text-gray-600">Name</label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>

//             <div>
//               <label className="block text-sm text-gray-600">Email</label>
//               <input
//                 type="email"
//                 value={userData?.email || ""}
//                 readOnly
//                 className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
//               />
//             </div>

//             <button
//               onClick={handleSaveProfile}
//               className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow max-w-xl">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">
//             Subscription Plan
//           </h2>

//           <p className="text-gray-700">
//             Current Plan:{" "}
//             <span className="font-medium capitalize">
//               {userData?.subscription?.status === "active"
//                 ? userData?.subscription?.planId || "Pro"
//                 : "Free"}
//             </span>
//           </p>

//           <p className="text-gray-500 text-sm mt-2">
//             Provider: {userData?.subscription?.provider?.toUpperCase()}
//           </p>

//           {userData?.subscription?.expiresAt && (
//             <p className="text-gray-500 text-sm mt-1">
//               Renews on:{" "}
//               {new Date(userData.subscription.expiresAt).toLocaleDateString()}
//             </p>
//           )}

//           <button
//             onClick={handleUpgradePlan}
//             className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Upgrade Plan
//           </button>

//         </div>
//       </>
//     )}
//   </div>
//         )} */}
    
//         {currentView === 'community' && <Community />}

//         {currentView === 'orders' && (
//   <div>
//     <h1 className="text-2xl font-bold text-gray-900 mb-4">Orders</h1>
//     <p className="text-gray-600 mb-6">Here’s your order summary</p>
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//       <div className="bg-white p-6 rounded-lg shadow">
//         <p className="text-sm text-gray-600">Total Orders</p>
//         <p className="text-2xl font-bold text-gray-900">120</p>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow">
//         <p className="text-sm text-gray-600">Paid</p>
//         <p className="text-2xl font-bold text-green-600">95</p>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow">
//         <p className="text-sm text-gray-600">Unpaid</p>
//         <p className="text-2xl font-bold text-red-600">25</p>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow">
//         <p className="text-sm text-gray-600">Refunded</p>
//         <p className="text-2xl font-bold text-orange-600">5</p>
//       </div>
//     </div>
//   </div>
//         )}

//         </main>

//         {showProductModal && (
//   <AddProductModal
//     onClose={() => {
//       setShowProductModal(false);
//       setSelectedProduct(null);
//     }}
//     onAddGenProduct={handleAddGenProduct}
//     fetchGenProducts={fetchGenProducts}
//     fetchMyProducts={fetchMyProducts}
//     generateWithAI={generateWithAI}
//     addToInventory={addToInventory}
//     token={token}
//     selectedStore={selectedStore}
//     selectedProduct={selectedProduct} 
//     isEditing={isEditing}
//     productMode={productMode}   

//   />
//         )}

//         {viewProductModal && (
//         <ViewProduct
//           onClose={() => {
//             setViewProductModal(false);
//             setSelectedProduct(null);
//           }}
//           fetchMyProducts={fetchMyProducts}
//           genProducts={genProducts}
//           fetchGenProducts={fetchGenProducts}
//           generateWithAI={generateWithAI}
//           addToInventory={addToInventory}
//           token={token}
//           selectedStore={selectedStore}
//           product={selectedProduct} // can be null for add mode
//         />
//         )}

//         {showAddProductOptions && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//     <div className="bg-white rounded-lg p-6 w-full max-w-md">
//       <h2 className="text-xl font-bold mb-4">Add Product</h2>
//       <button 
//         onClick={() => { setManualAdd(true); setShowAddProductOptions(false); }} 
//         className="w-full bg-blue-600 text-white py-2 rounded mb-3"
//       >
//         Add Manually
//       </button>
//       <button 
//         onClick={() => { setAiAdd(true); setShowAddProductOptions(false); }} 
//         className="w-full bg-purple-600 text-white py-2 rounded"
//       >
//         Generate with AI
//       </button>
//       <button 
//         onClick={() => setShowAddProductOptions(false)} 
//         className="mt-4 text-gray-500"
//       >
//         Cancel
//       </button>
//     </div>
//   </div>
//         )}
//   </div>
//   );

return (
  <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08)_0%,rgba(99,102,241,0.06)_35%,transparent_60%)]">

    {/* Navbar */}
    <Navbar setCurrentView={setCurrentView} />

    {/* Page Content */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Dashboard */}
      {currentView === "dashboard" && (
        <Dashboard
          stores={stores}
          selectedStore={selectedStore}
          myProducts={myProducts}
          allProductsData={allProductsData}
          loading={loading}
        />
      )}

      {/* Stores Page */}
      {currentView === "stores" && (
        <StoresPage
          stores={stores}
          setStores={setStores}
          newStore={newStore}
          setNewStore={setNewStore}
          storeCategories={storeCategories}
          createStore={createStore}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          openStoreWebsite={openStoreWebsite}
          myProducts={myProducts}
          navigate={navigate}
          token={token}
          setCurrentView={setCurrentView}
        />
      )}

      {/* Create Store */}
      {currentView === "create-store" && (
        <CreateStorePage
          newStore={newStore}
          setNewStore={setNewStore}
          storeCategories={storeCategories}
          createStore={createStore}
          navigate={navigate}
        />
      )}

      {/* Products */}
      {currentView === "products" && (
        <ProductsPage
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentProducts={getProductsByCategory(activeTab)}
          loading={loading}
          error={error}
          fetchProducts={fetchProducts}
          selectedStore={selectedStore}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          setShowProductModal={setShowProductModal}
          setProductMode={setProductMode}
          setSelectedProduct={setSelectedProduct}
          setIsEditing={setIsEditing}
          setViewProductModal={setViewProductModal}
          userId={userId}
          newArrivals={newArrivals}
        />
      )}

      {/* Inventory */}
      {currentView === "inventory" && (
        <InventoryPage
          stores={stores}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          myProducts={myProducts}
          setCurrentView={setCurrentView}
          handleDelete={handleDelete}
          updateInventoryItem={updateInventoryItem}
          publishProduct={publishProduct}
          generateWithAI={generateWithAI}
          openStoreWebsite={openStoreWebsite}
        />
      )}

      {/* Notifications */}
      {currentView === "notifications" && (
        <NotificationsPage
          user={user}
          notifications={notifications}
          setNotifications={setNotifications}
          loadingNotifications={loadingNotifications}
        />
      )}

      {/* Settings */}
      {currentView === "settings" && (
        <SettingsPage
          loading={loading}
          formData={formData}
          setFormData={setFormData}
          userData={userData}
          handleSaveProfile={handleSaveProfile}
          handleUpgradePlan={handleUpgradePlan}
        />
      )}

      {/* Community */}
      {currentView === "community" && <Community />}

      {/* Orders */}
      {/* {currentView === "orders" && (
        <OrdersPage />
      )} */}

    </main>

    {/* Modals */}
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
        stores={stores}
        genProducts={genProducts}
        fetchGenProducts={fetchGenProducts}
        generateWithAI={generateWithAI}
        addToInventory={addToInventory}
        token={token}
        selectedStore={selectedStore}
        product={selectedProduct}
      />
    )}

  </div>
);


};

import EditInventoryModal from "./EditInventoryModal";
import Community from './Community.jsx';
import NotificationsPage from '../NotificationsPage.jsx';
import SettingsPage from '../SettingsPage.jsx';
import CreateStorePage from '../CreateStorePage.jsx';
import Navbar from './DashboardNavbar.jsx';
import ProductsPage from '../ProductsPage.jsx';
import InventoryPage from '../Inventory/InventoryPage.jsx';
const InventoryRow = ({ item, onUpdate, onPublish, generateWithAI, onDelete }) => {
  console.log("inventory item", item);

  const [showModal, setShowModal] = useState(false);
  

  return (
   
    <>
  <tr
    className="group transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border-b border-gray-100"
  >
    {/* Product Info */}
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="h-12 w-12 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow duration-300"
          />
          {item.published && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">
              ✓
            </span>
          )}
        </div>
        <div className="ml-4">
          <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
            {item.name}
          </div>
          <div className="text-xs text-gray-500">{item.category}</div>
        </div>
      </div>
    </td>

    {/* Cost Price */}
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
      ₹{item.price}
    </td>

    {/* Selling Price */}
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
      ₹{item.sellingPrice}
    </td>

    {/* Quantity */}
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
      {item.quantity}
    </td>

    {/* Status */}
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all ${
          item.published
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full mr-2 ${
            item.published ? 'bg-green-500' : 'bg-yellow-500'
          }`}
        ></span>
        {item.published ? 'Published' : 'Unpublished'}
      </span>
    </td>

    {/* Actions */}
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 flex items-center">
      <button
        onClick={() => setShowModal(true)}
        className="text-blue-500 hover:text-blue-700 hover:scale-110 transition-transform duration-200"
        title="Edit"
      >
        <Edit3 className="h-4 w-4" />
      </button>

      {!item.published && (
        <button
          onClick={onPublish}
          className="text-green-500 hover:text-green-700 hover:scale-110 transition-transform duration-200"
          title="Publish to website"
        >
          <Upload className="h-4 w-4" />
        </button>
      )}

      <button
        className="text-gray-400 hover:text-gray-600 hover:scale-110 transition-transform duration-200"
        title="View product"
      >
        <Eye className="h-4 w-4" />
      </button>

      <button
        onClick={() => onDelete(item.productId, item)}
        className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform duration-200"
        title="Delete product"
      >
        <X className="h-4 w-4" />
      </button>
    </td>
  </tr>

  {/* Modal */}
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