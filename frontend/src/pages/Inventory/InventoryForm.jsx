// frontend/src/pages/Inventory/InventoryForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { generateWebsiteContent } from "../../utils/generateWebsiteContent";


export default function InventoryForm({ onCreated }) {
  const token = localStorage.getItem("token");
  const [stores, setStores] = useState([]);
  console.log("Stores loaded in InventoryForm:", stores);
  const [selectedStores, setSelectedStores] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    costPrice: "",
    sellingPrice: "",
    stock: "",
    published: false,
  });
  const [files, setFiles] = useState([]); // images + videos
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/stores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(Array.isArray(res.data) ? res.data : res.data.stores || []);
      } catch (e) {
        console.error("load stores", e);
      }
    })();
  }, []);

  const onFilesChange = (e) => {
    const arr = Array.from(e.target.files || []);
    setFiles(arr);
    setPreviews(arr.map((f) => ({ url: URL.createObjectURL(f), type: f.type })));
  };




  const submit = async () => {
  if (!form.name.trim()) return alert("Name is required");

  const fd = new FormData();
  // core fields
  fd.append("name", form.name);
  fd.append("description", form.description);
  fd.append("category", form.category);
  fd.append("costPrice", form.costPrice || 0);
  fd.append("sellingPrice", form.sellingPrice || 0);
  fd.append("stock", form.stock || 0);
  fd.append("published", form.published ? "true" : "false");

  // ✅ append all stores properly (not JSON string)
  selectedStores.forEach((sid) => fd.append("stores[]", sid));

  // media
  files.forEach((f) => fd.append("media", f));

try {
  const res = await axios.post("http://localhost:8000/api/inventory", fd, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  alert("✅ Inventory item created!");


// ✅ After successful product creation
for (const sid of selectedStores) {
  try {
    console.log(`🌐 Fetching WebProducts for store: ${sid}`);
    const resp = await fetch(`http://localhost:8000/api/web-products/${sid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await resp.json();
    console.log("📦 WebProduct API Response:", data);

    if (!data.success) {
      console.warn(`⚠️ Could not fetch products for store ${sid}`);
      continue;
    }

    const { store, products } = data;
    console.log(`✅ Received ${products.length} products for store '${store?.name}'`);

    const html = generateWebsiteContent(store, products);
    const blobUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));

    setStores((prev) =>
      prev.map((s) =>
        String(s._id || s.id) === String(sid) ? { ...s, localUrl: blobUrl } : s
      )
    );

    console.log(`🧩 Store '${store.name}' updated with ${products.length} products`);
  } catch (err) {
    console.error(`❌ Failed to fetch WebProducts for store ${sid}:`, err);
  }
}



  // // 🧠 Immediately regenerate each selected store’s site so product shows up
  // for (const sid of selectedStores) {
  //   await regenerateLocalSiteFromServer(sid);
  // }

  // 🔄 Reset form and refresh UI
  setForm({
    name: "",
    description: "",
    category: "",
    costPrice: "",
    sellingPrice: "",
    stock: "",
    published: false,
  });
  setFiles([]);
  setPreviews([]);
  setSelectedStores([]);
  onCreated?.(res.data.item);
} catch (e) {
  console.error("create inv", e);
  alert(e.response?.data?.message || "Failed");
}

};







  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="text-lg font-semibold mb-4">Add Inventory Item</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border rounded p-2"
          placeholder="Name *"
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
          className="border rounded p-2"
          placeholder="Cost Price"
          type="number"
          value={form.costPrice}
          onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Selling Price"
          type="number"
          value={form.sellingPrice}
          onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Stock"
          type="number"
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

      {/* Multi-store select */}
      <div className="mt-4">
        <label className="text-sm font-medium">Assign to Stores</label>
        <select
          multiple
          className="w-full border rounded p-2 mt-1"
          value={selectedStores}
          onChange={(e) =>
            setSelectedStores(
              Array.from(e.target.selectedOptions).map((o) => o.value)
            )
          }
        >
          {stores.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
      </div>

      {/* Media */}
      <div className="mt-4">
        <label className="text-sm font-medium">Images / Videos</label>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          className="mt-1"
          onChange={onFilesChange}
        />

        {previews.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {previews.map((p, i) =>
              p.type.startsWith("video/") ? (
                <video key={i} src={p.url} className="w-full h-28 object-cover rounded" controls />
              ) : (
                <img key={i} src={p.url} className="w-full h-28 object-cover rounded" />
              )
            )}
          </div>
        )}
      </div>

      <div className="mt-5">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={submit}
        >
          Save Item
        </button>
      </div>
      {/* Live store previews */}
      {console.log("Rendering store previews:", stores[4])}
{stores.length > 0 && (
  <div className="mt-10">
    <h4 className="text-lg font-semibold mb-2">Live Store Previews:</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stores.map((s) =>
        s.localUrl ? (
          <div key={s._id} className="border rounded-lg shadow overflow-hidden">
            <div className="p-2 font-medium">{s.name}</div>
            <iframe
              src={s.localUrl}
              title={s.name}
              className="w-full h-64 border-t"
            ></iframe>
          </div>
        ) : (
          <div key={s._id} className="p-6 text-gray-500 border rounded-lg">
            No live site yet for {s.name}
          </div>
        )
      )}
    </div>
  </div>
)}

    </div>
  );
}
