// AddProductModal.jsx
import React, { useState, useEffect } from "react";
import { X, Wand2, FileDown } from "lucide-react";
import Papa from "papaparse";

const AddProductModal = ({ 
  onClose, 
  fetchMyProducts, 
  generateWithAI, 
  token, 
  addToInventory, 
  selectedStore, 
  selectedProduct // 👈 pass in when editing
}) => {
  const isEditing = !!selectedProduct; // true if editing
  const isViewMode = !!(selectedProduct && !isEditing); 


  const [mode, setMode] = useState("manual");
  const [manualData, setManualData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  });
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 👇 Prefill when editing
  useEffect(() => {
    if (isEditing) {
      setManualData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        image: selectedProduct.image || "",
        category: selectedProduct.category || "",
      });
    }
  }, [isEditing, selectedProduct]);

  const handleAI = async (field) => {
    const aiValue = await generateWithAI(field, manualData[field]);
    setManualData((prev) => ({ ...prev, [field]: aiValue }));
  };

  const addOrUpdateProductAPI = async (product) => {
    try {
      const url = isEditing
        ? `http://localhost:8000/api/my-products/${selectedProduct.id}` // PUT for edit
        : "http://localhost:8000/api/my-products"; // POST for new

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...product,
        productId: product.productId || Date.now().toString(), // ✅ ensure productId exists
        storeId: selectedStore?.id || "default-store", // ✅ fallback store
          
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("❌ Save product failed:", error);
        return;
      }

      console.log("✅ Product saved:", product);
    } catch (err) {
      console.error("❌ Error saving product:", err);
    }
  };

  const handleFileUpload = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (isEditing) {
        console.log("selected product", selectedProduct.id);
        
      // EDIT PRODUCT (PUT)
      
      const res = await fetch(`http://localhost:8000/api/my-products/${selectedProduct.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...manualData,
          storeId: selectedStore?.id || null,
        }),
      });

      console.log("Edit response:", res.ok);

      if (!res.ok) {
        const error = await res.json();
        console.error("❌ Edit product failed:", error);
        return;
      }

      console.log("✅ Product updated:", manualData);
    } else {
      if (mode === "manual" || mode === "ai") {
        await addOrUpdateProductAPI(manualData);
      } else if (mode === "csv") {
        if (!csvFile) {
          alert("Please upload a CSV file first.");
          setLoading(false);
          return;
        }

        Papa.parse(csvFile, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            const bulkProducts = results.data.map((row) => ({
              name: row.name || "Unnamed Product",
              description: row.description || "No description",
              price: parseFloat(row.price) || 0,
              image: row.image || "https://via.placeholder.com/300x300",
              category: row.category || "General",
              productId: row.productId || Date.now().toString(),
            }));

            await fetch("http://localhost:8000/api/my-products/bulk", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                products: bulkProducts,
                storeId: selectedStore?.id || null,
              }),
            });

            fetchMyProducts(); // refresh after bulk insert
            onClose();
          },
          error: (err) => {
            console.error("CSV parse error:", err);
            alert("Failed to parse CSV file");
          },
        });
      }
    }

    fetchMyProducts(); // refresh inventory after any action
    onClose();
  } catch (err) {
    console.error("❌ Error submitting product:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          {/* <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2> */}
          <h2 className="text-xl font-semibold">
            {isViewMode ? "Product Details" : isEditing ? "Edit Product" : "Add Product"}
          </h2>

          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

         {/* Mode selector */}
         {!isEditing && (

         <div className="flex justify-center space-x-4 px-6 py-4 border-b">
          <button
            onClick={() => setMode("manual")}
            className={`px-3 py-1 rounded ${mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Manual
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`px-3 py-1 rounded ${mode === "ai" ? "bg-purple-600 text-white" : "bg-gray-100"}`}
          >
            AI Generate
          </button>
          <button
            onClick={() => setMode("csv")}
            className={`px-3 py-1 rounded ${mode === "csv" ? "bg-green-600 text-white" : "bg-gray-100"}`}
          >
            CSV Upload
          </button>
        </div>
)}

        {/* Content */}
        <div className="p-6 space-y-4">
  {isViewMode ? (
    <>
      <img 
        src={manualData.image} 
        alt={manualData.name} 
        className="w-full h-64 object-cover rounded"
      />
      <p className="text-lg font-semibold">{manualData.name}</p>
      <p className="text-gray-700">{manualData.description || "No description available."}</p>
      <p className="text-lg font-bold text-gray-900">${manualData.price}</p>
      <p className="text-sm text-gray-500">Category: {manualData.category}</p>
    </>
  ) : (
    (mode === "manual" || mode === "ai" || isEditing) && (
      <>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={manualData.name}
              onChange={(e) => setManualData({ ...manualData, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            {mode === "ai" && !isEditing && (
              <button
                onClick={() => handleAI("name")}
                className="text-purple-600 hover:text-purple-800"
                title="Generate with AI"
              >
                <Wand2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <div className="flex items-center space-x-2">
            <textarea
              value={manualData.description}
              onChange={(e) => setManualData({ ...manualData, description: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            {mode === "ai" && (
              <button
                onClick={() => handleAI("description")}
                className="text-purple-600 hover:text-purple-800"
                title="Generate with AI"
              >
                <Wand2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={manualData.price}
              onChange={(e) => setManualData({ ...manualData, price: parseFloat(e.target.value) })}
              className="w-full border rounded px-3 py-2"
            />
            {mode === "ai" && (
              <button
                onClick={() => handleAI("price")}
                className="text-purple-600 hover:text-purple-800"
                title="Generate with AI"
              >
                <Wand2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="text"
            value={manualData.image}
            onChange={(e) => setManualData({ ...manualData, image: e.target.value })}
            placeholder="Image URL"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={manualData.category}
            onChange={(e) => setManualData({ ...manualData, category: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </>
    )
  )}

  {mode === "csv" && !isViewMode && (
    <div className="space-y-4">
      <label className="block text-sm font-medium mb-1">Upload CSV</label>
      <input type="file" accept=".csv" onChange={handleFileUpload} className="w-full" />
      <a
        href="/sample_products_template.csv"
        download
        className="flex items-center text-sm text-green-600 hover:underline"
      >
        <FileDown className="h-4 w-4 mr-1" />
        Download Template
      </a>
    </div>
  )}
</div>


        {/* Footer */}
        {/* <div className="flex justify-end space-x-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Product"
              : "Save Product"}
          </button>
        </div> */}

        {/* Footer */}
<div className="flex justify-end space-x-3 border-t px-6 py-4">
  <button
    onClick={onClose}
    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
  >
    Cancel
  </button>
  {isViewMode ? (
    <button
      onClick={() => addToInventory(manualData)} // you’ll pass addToInventory via props
      className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
    >
      Add to Inventory
    </button>
  ) : (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className={`px-6 py-2 rounded-lg text-white ${
        loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {loading ? "Saving..." : isEditing ? "Update Product" : "Save Product"}
    </button>
  )}
</div>

      </div>
    </div>
  );
};

export default AddProductModal;
