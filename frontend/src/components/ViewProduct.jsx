// ViewProductModal.jsx
import React from "react";
import { 
  Store, Plus, Search, TrendingUp, Calendar, DollarSign, Package, Edit3, Eye, ExternalLink,
  Wand2, ShoppingCart, Star, X, Check, Upload, Globe, Settings, Loader
} from 'lucide-react';

const ViewProduct = ({ product, onClose, fetchMyProducts, selectedStore, token }) => {
  if (!product) return null;


    const addToInventory = async (product) => {
    try {
      if (!selectedStore?._id) {
      alert("Please select a store first.");
      return;
    }
      console.log("product", product);
      if (token) {
        const response = await fetch('https://hivehub-y2u8.onrender.com/api/my-products', {
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
      onClose(false);
    } catch (error) {
      console.error('Error adding product to inventory:', error);
    }
  };

  return (
    // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    //   <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
    //     {/* Header */}
    //     <div className="flex justify-between items-center border-b px-6 py-4">
    //       <h2 className="text-xl font-semibold">Product Details</h2>
    //       <button onClick={onClose}>
    //         <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
    //       </button>
    //     </div>

    //     {/* Content */}
    //     <div className="p-6 space-y-4">
    //       <img
    //         src={product.image || "https://via.placeholder.com/300x300"}
    //         alt={product.name}
    //         className="w-full h-64 object-cover rounded"
    //       />
    //       <div>
    //         <p className="text-lg font-semibold">{product.name}</p>
    //         <p className="text-gray-700">
    //           {product.description || "No description available."}
    //         </p>
    //         <p className="text-lg font-bold text-gray-900">${product.price}</p>
    //         <p className="text-sm text-gray-500">
    //           Category: {product.category || "Uncategorized"}
    //         </p>
    //       </div>
    //     </div>

    //     {/* Footer */}
    //     <div className="flex justify-end border-t px-6 py-4">
    //       <button
    //         onClick={onClose}
    //         className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
    //       >
    //         Close
    //       </button>
    //     </div>
    //   </div>
    // </div>

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
              <button onClick={() => onClose(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => addToInventory(product)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add to Inventory</button>
            </div>
          </div>
        </div>
  );
};

export default ViewProduct;
