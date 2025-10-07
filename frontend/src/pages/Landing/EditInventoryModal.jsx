
import React, { useEffect, useState } from "react";
import { Edit3, Upload, Eye, X, Wand2, Check } from "lucide-react";

// EditInventoryModal - shows a modal with labeled fields and image preview
const EditInventoryModal = ({ item, onUpdate, generateWithAI, onClose }) => {
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    sellingPrice: "",
    quantity: "",
    category: "",
    imageFile: null,
  });

  const [previewUrl, setPreviewUrl] = useState("");

  // Initialize form when modal opens or item changes
  useEffect(() => {
    setEditData({
      name: item?.name || "",
      price: item?.price ?? "",
      sellingPrice: item?.sellingPrice ?? "",
      quantity: item?.quantity ?? "",
      category: item?.category || "",
      imageFile: null,
    });
    setPreviewUrl(item?.image || "");
  }, [item]);

  // Update preview when file changes and clean up object URLs
  useEffect(() => {
    if (!editData.imageFile) return;
    const url = URL.createObjectURL(editData.imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [editData.imageFile]);

  const handleAIGenerate = async (field) => {
    if (!generateWithAI) return;
    try {
      const newValue = await generateWithAI(field, editData[field], editData.name);
      setEditData((p) => ({ ...p, [field]: newValue }));
    } catch (err) {
      console.error("AI generation failed:", err);
    }
  };

  const handleSave = () => {
    // Basic validation (name required)
    if (!editData.name || editData.name.trim() === "") return;

    const formData = new FormData();
    console.log("item", item);
    const pid = item?.productId || item?._id || "";
    formData.append("productId", pid);
    formData.append("storeId", item?.storeId || "");
    formData.append("name", editData.name);
    formData.append("price", editData.price ?? "");
    formData.append("sellingPrice", editData.sellingPrice ?? "");
    formData.append("quantity", editData.quantity ?? "");
    formData.append("category", editData.category ?? "");

    if (editData.imageFile) formData.append("image", editData.imageFile);

    onUpdate(pid, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          aria-label="Close edit modal"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit product</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left column - image preview & upload */}
          <div className="md:col-span-1 flex flex-col items-center">
            <label className="text-sm font-medium text-gray-700 mb-2">Product image</label>

            <div className="w-full flex items-center justify-center border rounded p-3 mb-2">
              {previewUrl ? (
                <img src={previewUrl} alt={editData.name || "product image"} className="w-full h-48 object-contain rounded" />
              ) : (
                <div className="text-sm text-gray-400">No image</div>
              )}
            </div>

            <input
              id={`file-${item?._id || item?.productId}`}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setEditData((p) => ({ ...p, imageFile: f }));
              }}
              className="text-sm text-gray-600"
            />
            <button
                  onClick={() => handleAIGenerate("image")}
                  title="Generate name with AI"
                  className="text-purple-600 hover:text-purple-800"
                >
                  <Wand2 className="h-4 w-4" />
                </button>
            <p className="mt-2 text-xs text-gray-500">Upload a new image to replace current one.</p>
          </div>

          {/* Right column - fields */}
          <div className="md:col-span-2 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product name</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter product name"
                />
                <button
                  onClick={() => handleAIGenerate("name")}
                  title="Generate name with AI"
                  className="text-purple-600 hover:text-purple-800"
                >
                  <Wand2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cost price</label>
                <input
                  type="number"
                  value={editData.price}
                  onChange={(e) => setEditData((p) => ({ ...p, price: e.target.value }))}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Selling price</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    value={editData.sellingPrice}
                    onChange={(e) => setEditData((p) => ({ ...p, sellingPrice: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    placeholder="0.00"
                    step="0.01"
                  />
                  
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={editData.quantity}
                  onChange={(e) => setEditData((p) => ({ ...p, quantity: e.target.value }))}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={editData.category}
                onChange={(e) => setEditData((p) => ({ ...p, category: e.target.value }))}
                className="mt-1 w-full border rounded px-3 py-2 h-24"
                placeholder="Write a short description"
              />
              <button
                  onClick={() => handleAIGenerate("category")}
                  title="Generate name with AI"
                  className="text-purple-600 hover:text-purple-800"
                >
                  <Wand2 className="h-4 w-4" />
                </button>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center"
                aria-disabled={!editData.name}
              >
                <Check className="h-4 w-4 mr-2" /> Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInventoryModal;