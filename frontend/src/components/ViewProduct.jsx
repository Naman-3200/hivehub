// ViewProductModal.jsx
import React from "react";
import { useState } from "react";
import { 
  Store, Plus, Search, TrendingUp, Calendar, DollarSign, Package, Edit3, Eye, ExternalLink,
  Wand2, ShoppingCart, Star, X, Check, Upload, Globe, Settings, Loader
} from 'lucide-react';

const ViewProduct = ({ product, onClose, fetchMyProducts, selectedStore, token, genProducts, stores }) => {
  const [selectedStores, setSelectedStores] = useState([]);

  if (!product) return null;
  console.log("Viewing product:", genProducts);





//     const addToInventory = async (product) => {
//     try {
//       if (!selectedStore?._id) {
//       alert("Please select a store first.");
//       return;
//     }
//       console.log("product", product);
//       if (token) {
//         const response = await fetch(`https://hivehub-1.onrender.com/api/inventory`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             // productId: product.id,
//             // storeId: selectedStore?.id
//             productId: product.id,
//           name: product.name,
//           price: product.originalPrice,
//           image: product.image,
//           category: product.category,
//           sellingPrice: product.sellingPrice,
//           quantity: 1,
//           storeId: selectedStore?._id,
//           published: true   // 👈 new line

//           })
//         });
        
//         if (response.ok) {
//   fetchMyProducts();
//   // ✅ Toast message
//   const toast = document.createElement('div');
//   toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
//   toast.textContent = `"${product.name}" added to inventory!`;
//   document.body.appendChild(toast);
//   setTimeout(() => toast.remove(), 3000);
// }
//       }
//       onClose(false);
//     } catch (error) {
//       console.error('Error adding product to inventory:', error);
//     }
//   };



  const addToInventory = async (product) => {
  try {
    // if (!selectedStore?._id) {
    //   alert("Please select a store first.");
    //   return;
    // }

    if (!token) {
      alert("Missing auth token!");
      return;
    }

    console.log("🟦 Adding product to inventory:", product);

    // ✅ Build FormData (backend requires multipart)
    const fd = new FormData();
    fd.append("name", product.name);
    fd.append("description", product.description || "");
    fd.append("category", product.category || "");
    fd.append("costPrice", product.originalPrice || 0);
    fd.append("sellingPrice", product.sellingPrice || product.price || 0);
    fd.append("stock", 1);
    fd.append("published", "true");

    // ✅ Correct way to pass store (backend expects stores[])
    // fd.append("stores[]", selectedStore._id);

    selectedStores.forEach((storeId) => {
      fd.append("stores[]", storeId);
    });

    // ✅ If generated product already has a Cloudinary image URL:
    if (product.image && typeof product.image === "string") {
      // Send URL string — backend will treat it as is
      fd.append("imageUrl", product.image);
    }

    // ✅ If product.image is a File (manual upload case)
    if (product.image instanceof File) {
      fd.append("media", product.image);
    }

    // ✅ Send to backend
    const res = await fetch(`https://hivehub-1.onrender.com/api/inventory`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ DO NOT SET Content-Type manually — browser sets boundary automatically
      },
      body: fd,
    });

    const data = await res.json();
    console.log("✅ Inventory response:", data);

    if (!res.ok) {
      console.error("❌ Inventory error:", data);
      alert(data.message || "Failed to add to inventory");
      return;
    }

    // ✅ Refresh list after success
    await fetchMyProducts();

    // ✅ Better toast UX
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50";
    toast.textContent = `"${product.name}" added to inventory! ✅`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);

    onClose(false);
  } catch (error) {
    console.error("❌ Error adding product to inventory:", error);
    alert("Something went wrong while adding the item.");
  }
};




  return (
 

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
              <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{product.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({product.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    <span className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice}</span>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cost Price:</span>
                      <span className="font-medium">${product.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Suggested Retail:</span>
                      <span className="font-medium">${(product.price * 1.5).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Potential Profit:</span>
                      <span className="font-medium text-green-600">${(product.price * 0.5).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                            <div className="mb-4">
  <label className="block font-medium mb-2">Add to Stores:</label>

  <div className="space-y-2">
    {stores.map((store) => (
      <label key={store._id} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedStores.includes(store._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedStores((prev) => [...prev, store._id]);
            } else {
              setSelectedStores((prev) => prev.filter((id) => id !== store._id));
            }
          }}
        />
        <span>{store.name}</span>
      </label>
    ))}
  </div>
              </div>
              <button onClick={() => onClose(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => addToInventory(product)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add to Inventory</button>
            </div>
          </div>
        </div>
  );
};

export default ViewProduct;
