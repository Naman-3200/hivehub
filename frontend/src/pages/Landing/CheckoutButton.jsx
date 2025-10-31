// src/components/CheckoutButton.jsx
import React from "react";
import axios from "axios";

const CheckoutButton = ({ planId }) => {
  const handleCheckout = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/whop/checkout", {
        planId,
      });
      window.location.href = res.data.purchaseUrl; // Redirect to Whop checkout
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout.");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Pay with Whop
    </button>
  );
};

export default CheckoutButton;
