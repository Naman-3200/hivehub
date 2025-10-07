// AddProductModal.jsx
import React, { useState, useEffect } from "react";
import { X, Wand2, FileDown } from "lucide-react";
import Papa from "papaparse";

const AddProductModal = ({
  onClose,
  fetchMyProducts,
  generateWithAI, // optional helper for single-field AI
  token,
  addToInventory, // function provided by parent
  selectedStore,
  selectedProduct, // optional; may be edit or view
  viewOnly, // optional prop: if true, show view-only mode
  productMode,
  fetchGenProducts, 
  onAddGenProduct
}) => {
  // View vs Edit logic: allow `viewOnly` override if parent supplies it
  const isViewMode = !!viewOnly || !!(selectedProduct && selectedProduct.viewOnly);
  const isEditing = !!selectedProduct && !isViewMode;

  // const [mode, setMode] = useState("manual"); // 'manual' | 'csv' | 'ai'
  const [manualData, setManualData] = useState({
    name: "",
    description: "",
    price: "",
    images: [],
    category: "",
    costPrice: "",
    profit: ""
  });
  
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(productMode || "manual");

  // AI products state (GenProducts)
  const [genProducts, setGenProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Prefill when editing or viewing
  useEffect(() => {
    if (isEditing || isViewMode) {
      setManualData({
        name: selectedProduct?.name || "",
        description: selectedProduct?.description || "",
        price: selectedProduct?.price ?? selectedProduct?.sellingPrice ?? "",
        image: selectedProduct?.image || "",
        category: selectedProduct?.category || "",
        costPrice: selectedProduct?.costPrice ?? "",
        profit: selectedProduct?.profit ?? ""
      });
    }
  }, [isEditing, isViewMode, selectedProduct]);

  // Auto-calc profit when price or costPrice changes
  useEffect(() => {
    const price = parseFloat(manualData.price) || 0;
    const cost = parseFloat(manualData.costPrice) || 0;
    const profit = price - cost;
    setManualData(prev => ({ ...prev, profit: Number.isFinite(profit) ? parseFloat(profit.toFixed(2)) : "" }));
    // only depend on price/cost
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualData.price, manualData.costPrice]);

  

  const handleManualSubmit = async () => {
  try {
    const formData = new FormData();
    formData.append("name", manualData.name);
    formData.append("description", manualData.description);
    formData.append("category", manualData.category);
    formData.append("originalPrice", manualData.costPrice);
    formData.append("sellingPrice", manualData.price);
    formData.append("potentialProfit", manualData.profit);

    // append multiple images
    manualData.images.forEach((file) => {
      formData.append("images", file);
    });

    const res = await fetch("https://hivehub-1.onrender.com/api/add-gen-products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ send token if required
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to save manual product");
    }

    const data = await res.json();


    if (onAddGenProduct) {
      onAddGenProduct(data.product || data);
    }


    console.log("✅ Manual product saved:", data);

    onClose()
  } catch (err) {
    console.error("❌ Error saving manual product:", err);
  }
};


  // Fetch when modal mounts and when mode changes to ai
  useEffect(() => {
    fetchGenProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode === "ai") fetchGenProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Field-level AI (your existing generateWithAI helper)
  const handleAI = async (field) => {
    if (typeof generateWithAI !== "function") {
      alert("AI helper not available");
      return;
    }
    try {
      setLoading(true);
      const aiValue = await generateWithAI(field, manualData[field]);
      setManualData(prev => ({ ...prev, [field]: aiValue }));
    } catch (err) {
      console.error("Field AI error:", err);
      alert("AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  // Generate full product via GenProducts API (real AI or fallback)
  const generateProduct = async () => {
    if (!category || category.trim().length === 0) {
      alert("Please enter a category to generate products.");
      return;
    }

    console.log("category", category);
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch(`${ "https://hivehub-1.onrender.com"}/api/gen-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ category: category.trim() })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`AI generate failed: ${res.status} ${text}`);
      }

      const product = await res.json();

      if (product.error) {
  throw new Error(product.error + (product.rawOutput ? " | Raw: " + product.rawOutput : ""));
}
      // Prepend to list
      setGenProducts(prev => [product, ...prev]);
      setCategory("");
    } catch (err) {
      console.error("Generate Product error:", err);
      setAiError(err.message || "Failed to generate product");
      alert("Failed to generate product: " + (err.message || ""));
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    setCsvFile(e.target.files[0] || null);
  };

  // Use your existing add/update API logic (kept mostly as-is)
  const addOrUpdateProductAPI = async (product, imageFiles) => {
    try {
      const url = isEditing
        ? `${ "https://hivehub-1.onrender.com"}/api/my-products/${selectedProduct._id || selectedProduct.id}`
        : `${"https://hivehub-1.onrender.com"}/api/my-products`;
      const method = isEditing ? "PUT" : "POST";

      // const body = {
      //   ...product,
      //   productId: product.productId || product._id || Date.now().toString(),
      //   storeId: selectedStore?._id || selectedStore?.id || null
      // };


      const formData = new FormData();
    formData.append("productId", product.productId || product._id || Date.now().toString());
    formData.append("storeId", selectedStore?._id || selectedStore?.id || "");
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("sellingPrice", product.sellingPrice);
    formData.append("quantity", product.quantity || 1);
    formData.append("category", product.category);

    // Append multiple images
    if (imageFiles && imageFiles.length > 0) {
      Array.from(imageFiles).forEach((file) => {
        formData.append("image", file);
      });
    }

      const res = await fetch(url, {
        method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("❌ Save product failed:", error);
        throw new Error(error || "Save failed");
      }

      return await res.json();
    } catch (err) {
      console.error("❌ Error saving product:", err);
      throw err;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEditing) {
        // Edit product
        await addOrUpdateProductAPI(manualData);
      } else {
        if (mode === "manual" ) {
          await addOrUpdateProductAPI(manualData);
        } 
        else if (mode === "ai"){
          await generateProduct();
        }
        else if (mode === "csv") {
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
                productId: row.productId || Date.now().toString()
              }));

              await fetch(`${"https://hivehub-1.onrender.com"}/api/my-products/bulk`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                  products: bulkProducts,
                  storeId: selectedStore?._id || selectedStore?.id || null
                })
              });

              fetchMyProducts();
              onClose();
            },
            error: (err) => {
              console.error("CSV parse error:", err);
              alert("Failed to parse CSV file");
            }
          });
        }
      }

      // Refresh and close
      await fetchMyProducts();
      onClose();
    } catch (err) {
      console.error("Error on submit:", err);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  // When adding a generated product into inventory, map fields expected by addToInventory
  const handleAddGenToInventory = async (p) => {
    const payload = {
      productId: p._id || p.productId || Date.now().toString(),
      name: p.name,
      price: p.sellingPrice ?? p.originalPrice ?? p.price ?? 0,
      image: p.image,
      category: p.category || manualData.category || "",
      // storeId will be added in addToInventory or by backend using selectedStore prop
    };

    try {
      // addToInventory should be responsible for sending the API request and refreshing inventory
      await addToInventory(payload);
      // Optionally refresh MyProducts list and close modal (or keep open)
      await fetchMyProducts();
      alert(`"${p.name}" added to inventory`);
    } catch (err) {
      console.error("Failed to add generated product to inventory:", err);
      alert("Failed to add generated product to inventory");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mt-8 mb-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold">
            {isViewMode ? "Product Details" : isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

       

        {/* Mode selector */}
      {!isEditing && productMode === "manual" && (
        <div className="flex justify-center space-x-4 px-6 py-4 border-b">
          <button
            onClick={() => setMode("manual")}
            className={`px-3 py-1 rounded ${mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Manual
          </button>
          <button
            onClick={() => setMode("csv")}
            className={`px-3 py-1 rounded ${mode === "csv" ? "bg-green-600 text-white" : "bg-gray-100"}`}
          >
            Bulk Upload
          </button>
        </div>
      )}

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Manual / Edit / View */}
          {isViewMode ? (
            <>
              <img src={manualData.images} alt={manualData.name} className="w-full h-64 object-cover rounded" />
              <p className="text-lg font-semibold">{manualData.name}</p>
              <p className="text-gray-700">{manualData.description || "No description available."}</p>
              <p className="text-lg font-bold text-gray-900">${manualData.price}</p>
              <p className="text-sm text-gray-500">Category: {manualData.category}</p>
            </>
          ) : mode === "manual" || isEditing ? (
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
                    <button onClick={() => handleAI("name")} className="text-purple-600 hover:text-purple-800" title="Generate name with AI">
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
                    <button onClick={() => handleAI("description")} className="text-purple-600 hover:text-purple-800" title="Generate description with AI">
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
                    onChange={(e) => setManualData({ ...manualData, price: e.target.value === "" ? "" : parseFloat(e.target.value) })}
                    className="w-full border rounded px-3 py-2"
                  />
                  {mode === "ai" && (
                    <button onClick={() => handleAI("price")} className="text-purple-600 hover:text-purple-800" title="Generate price with AI">
                      <Wand2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Image */}
             <div>
  <label className="block text-sm font-medium mb-1">Upload Images</label>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => setManualData({ ...manualData, images: Array.from(e.target.files) })}
    className="w-full border rounded px-3 py-2"
  />

  {/* Preview selected images */}
  {/* {manualData.images && manualData.images.length > 0 && (
    <div className="flex gap-2 mt-2 flex-wrap">
      {manualData.images.map((file, i) => (
        <img
          key={i}
          src={URL.createObjectURL(file)}
          alt="preview"
          className="w-20 h-20 object-cover rounded"
        />
      ))}
    </div>
  )} */}

  {/* {Array.isArray(manualData.images) && manualData.images.length > 0 ? (
  <img
    src={manualData.images[0]}  // ✅ show first image if array
    alt={manualData.name}
    className="w-full h-64 object-cover rounded"
  />
) : (
  <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
    <span className="text-gray-500">No image</span>
  </div>
)} */}


{Array.isArray(manualData.images) && manualData.images.length > 0 ? (
  manualData.images.map((img, i) => (
    <img
      key={i}
      src={typeof img === "string" ? img : URL.createObjectURL(img)}
      alt={manualData.name}
      className="w-full h-64 object-cover rounded mb-2"
    />
  ))
) : (
  <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
    <span className="text-gray-500">No image</span>
  </div>
)}



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

              {/* Cost Price */}
              <div>
                <label className="block text-sm font-medium mb-1">Cost Price</label>
                <input
                  type="number"
                  value={manualData.costPrice || ""}
                  onChange={(e) => setManualData({ ...manualData, costPrice: e.target.value === "" ? "" : parseFloat(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Profit */}
              <div>
                <label className="block text-sm font-medium mb-1">Profit</label>
                <input
                  type="number"
                  value={manualData.profit || ""}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>
            </>
          ) : null}

          {/* CSV Upload tab */}
          {mode === "csv" && !isViewMode && (
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-1">Upload CSV</label>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="w-full" />
              <a href="/sample_products_template.csv" download className="flex items-center text-sm text-green-600 hover:underline">
                <FileDown className="h-4 w-4 mr-1" />
                Download Template
              </a>
            </div>
          )}

          {/* AI tab */}
          {mode === "ai" && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">🆕 AI Generated Products</h3>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter category (e.g., Shoes)"
                  className="border p-2 rounded flex-1"
                />
                <button onClick={generateProduct} disabled={aiLoading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-60">
                  {aiLoading ? "Generating..." : "Generate with AI"}
                </button>
              </div>

              {aiError && <div className="text-red-600 mb-3">{aiError}</div>}
              {genProducts.length === 0 ? (
                <div className="text-gray-500">No AI products yet. Generate one above.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {genProducts.map((p) => (
                    <div key={p._id || p.productId} className="border rounded-lg p-4 shadow">
                      <img src={p.image} alt={p.name} className="h-32 w-full object-cover rounded" />
                      <h3 className="font-semibold mt-2">{p.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{p.description}</p>
                      <div className="flex justify-between mt-2 text-sm text-gray-700">
                        <span>⭐ {(p.ratings || 0).toFixed(1)} ({p.reviews || 0} reviews)</span>
                        <span>Profit: ${p.potentialProfit ?? ( (p.sellingPrice||0) - (p.originalPrice||0) )}</span>
                      </div>
                      <div className="mt-2">
                        <span className="line-through text-gray-400 mr-2">${p.originalPrice ?? "-"}</span>
                        <span className="text-green-600 font-bold">${p.sellingPrice ?? p.price ?? "-"}</span>
                      </div>
                      <button
                        onClick={() => handleAddGenToInventory(p)}
                        className="mt-3 w-full bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700"
                      >
                        Add to Inventory
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 border-t px-6 py-4">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>

          {isViewMode ? (
            <button onClick={() => addToInventory(manualData)} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">
              Add to Inventory
            </button>
          ) : (
            // <button
            //   onClick={handleSubmit}
            //   disabled={loading}
            //   className={`px-6 py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
            // >
            //   {loading ? "Saving..." : isEditing ? "Update Product" : "Save Product"}
            // </button>

            <button
  onClick={() => {
    if (mode === "manual") {
      handleManualSubmit();
    } else {
      handleSubmit(); // your existing AI submit function
    }
  }}
  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
>
  Submit
</button>

          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
