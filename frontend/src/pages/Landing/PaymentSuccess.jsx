// pages/PaymentSuccess.jsx
import React, { useEffect } from "react";
import axios from "axios";

const PaymentSuccess = () => {
  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("orderId");
    const token = localStorage.getItem("token");
    if (orderId && token) {
      axios.post("http://localhost:8000/api/orders/mark-paid", { orderId }, { headers: { Authorization: `Bearer ${token}` }});
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-3">✅ Payment Successful!</h1>
      <p className="text-gray-700">Thank you for your purchase.</p>
    </div>
  );
};
export default PaymentSuccess;
