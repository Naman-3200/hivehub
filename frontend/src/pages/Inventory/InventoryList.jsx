// frontend/src/pages/Inventory/InventoryList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import InventoryForm from "./InventoryForm";
import ProductDetailsModal from "./ProductDetailsModal";

export default function InventoryList() {
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);

  const load = async () => {
    const res = await axios.get("http://localhost:8000/api/inventory", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // You can implement GET /api/inventory (list) similarly; if not, fetch from your existing list endpoint
    setItems(res.data.items || []);
  };

  useEffect(() => {
    // If you don't have list route, temporarily comment this and rely on onCreated push
    load().catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <InventoryForm onCreated={(it) => setItems((p) => [it, ...p])} />

      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Inventory</h3>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Product</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Stores</th>
                <th className="text-left p-2">Media</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id} className="border-t">
                  <td className="p-2">{it.name}</td>
                  <td className="p-2">₹{Number(it.sellingPrice || 0).toLocaleString()}</td>
                  <td className="p-2">{(it.stores || []).length}</td>
                  <td className="p-2">{(it.images?.length || 0) + (it.videos?.length || 0)}</td>
                  <td className="p-2">
                    <button
                      className="px-3 py-1 rounded bg-gray-800 text-white"
                      onClick={async () => {
                        // ensure we fetch populated stores for modal
                        const r = await axios.get(`http://localhost:8000/api/inventory/${it._id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        setActive(r.data.item);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No inventory yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {active && <ProductDetailsModal item={active} onClose={() => setActive(null)} />}
    </div>
  );
}
