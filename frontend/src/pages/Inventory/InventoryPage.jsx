// frontend/src/pages/Inventory/InventoryPage.jsx
import React from "react";
import InventoryList from "./InventoryList";

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        🏷️ Inventory Management
      </h1>
      <InventoryList />
    </div>
  );
}
