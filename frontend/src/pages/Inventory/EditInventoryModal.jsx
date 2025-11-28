import React, { useState } from "react";
import axios from "axios";
import { generateWebsiteContent } from "../generateWebsiteContent";


export default function EditInventoryModal({ item, onClose, onUpdated }) {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: item.name || "",
    description: item.description || "",
    category: item.category || "",
    costPrice: item.costPrice || "",
    sellingPrice: item.sellingPrice || "",
    stock: item.stock || "",
    published: item.published || false,
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onFilesChange = (e) => {
    const arr = Array.from(e.target.files || []);
    setFiles(arr);
  };

const submit = async () => {
  setLoading(true);
  try {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    files.forEach((f) => fd.append("media", f));

    const res = await axios.put(`http://localhost:8000/api/inventory/${item._id}`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("✅ Inventory updated successfully!");
    onUpdated?.(res.data.item);
    onClose();

 // ✅ Refresh and rebuild each store’s live site locally
if (res.data.item?.stores?.length) {
  console.log("♻️ Regenerating store HTML after edit...");

  for (const sid of res.data.item.stores) {
    try {
      // 1️⃣ Fetch updated WebProducts for this store
      const resp = await fetch(`http://localhost:8000/api/web-products/${sid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();

      if (data.success && data.store && Array.isArray(data.products)) {
        console.log(
          `🧩 Rebuilding store '${data.store.name}' with ${data.products.length} products`
        );

        // 2️⃣ Rebuild HTML blob
        const html = generateWebsiteContent(data.store, data.products);
        const blobUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));

        // 3️⃣ Update global store preview (if you keep stores[] in state)
        if (window.updateStoreLocalUrl) {
          // global function you can define in parent
          window.updateStoreLocalUrl(sid, blobUrl);
        }

        // 4️⃣ Optional: open fresh store preview immediately
        console.log(`✅ Store ${data.store.name} refreshed successfully`);
      } else {
        console.warn(`⚠️ No valid data for store ${sid}`);
      }
    } catch (err) {
      console.error(`❌ Error regenerating store ${sid}:`, err);
    }
  }
}

  } catch (e) {
    console.error("updateInventory failed:", e);
    alert(e.response?.data?.message || "Failed to update inventory");
  } finally {
    setLoading(false);
  }
};


  

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded p-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border rounded p-2"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            type="number"
            className="border rounded p-2"
            placeholder="Cost Price"
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
          />
          <input
            type="number"
            className="border rounded p-2"
            placeholder="Selling Price"
            value={form.sellingPrice}
            onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
          />
          <input
            type="number"
            className="border rounded p-2"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published
          </label>
        </div>

        <textarea
          className="border rounded p-2 mt-3 w-full"
          rows={3}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="mt-4">
          <label className="text-sm font-medium">Add New Media (optional)</label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="mt-1"
            onChange={onFilesChange}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
