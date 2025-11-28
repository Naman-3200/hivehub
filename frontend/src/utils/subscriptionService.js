const API_URL = "https://hivehub-1.onrender.com/api/subscription";

export const createWhopCheckout = async (token, planId) => {
  const res = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ planId }),
  });
  return res.json();
};
