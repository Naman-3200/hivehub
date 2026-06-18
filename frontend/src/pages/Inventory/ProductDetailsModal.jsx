// frontend/src/pages/Inventory/ProductDetailsModal.jsx
import React, { useState } from "react";

export default function ProductDetailsModal({ item, onClose }) {
  const media = [
    ...(item?.images || []).map((url) => ({ type: "image", url })),
    ...(item?.videos || []).map((url) => ({ type: "video", url })),
  ];
  const [active, setActive] = useState(media[0] || null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold">{item?.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {active ? (
              active.type === "video" ? (
                <video src={active.url} className="w-full max-h-[380px] rounded" controls />
              ) : (
                <img src={active.url} className="w-full max-h-[380px] object-contain rounded" />
              )
            ) : (
              <div className="border rounded h-64 flex items-center justify-center text-gray-400">No media</div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Category</div>
              <div className="font-medium">{item?.category || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Price</div>
              <div className="font-medium">
                ₹{Number(item?.sellingPrice || 0).toLocaleString()}
                <span className="text-xs text-gray-500 ml-2">
                  (Cost ₹{Number(item?.costPrice || 0).toLocaleString()})
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Stores</div>
              <div className="text-sm">
                {(item?.stores || []).map((s) => s.name).join(", ") || "-"}
              </div>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {item?.description || "No description"}
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        {media.length > 0 && (
          <div className="mt-4 grid grid-cols-6 gap-2">
            {media.map((m, i) =>
              m.type === "video" ? (
                <div
                  key={i}
                  onClick={() => setActive(m)}
                  className={`cursor-pointer border rounded overflow-hidden ${active?.url === m.url ? "ring-2 ring-blue-500" : ""}`}
                >
                  <video src={m.url} className="w-full h-20 object-cover" />
                </div>
              ) : (
                <img
                  key={i}
                  onClick={() => setActive(m)}
                  src={m.url}
                  className={`w-full h-20 object-cover rounded cursor-pointer ${active?.url === m.url ? "ring-2 ring-blue-500" : ""}`}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
