// WHOP_API_KEY=
// NEXT_PUBLIC_WHOP_APP_ID=app_Ui8X1Cw5Yalr1X
// NEXT_PUBLIC_WHOP_AGENT_USER_ID=user_JlsOLaoXVEEXE
// NEXT_PUBLIC_WHOP_COMPANY_ID=biz_iIibnXKxVTZ1Tp


import axios from "axios";

const WHOP_API_KEY = "kts3MMnb3M-1K1wX319Yd2NLxJ2EIiSZx6OFQqGS1wM"; // get from env
const WHOP_BASE_URL = "https://api.whop.com/v2";

export const createWhopCheckout = async (order) => {
  try {
    const response = await axios.post(
      `${WHOP_BASE_URL}/checkouts`,
      {
        name: `Order #${order._id}`,
        description: `Checkout for store ${order.storeId}`,
        price_cents: Math.round(order.totalPrice * 100),
        redirect_url: `${process.env.FRONTEND_URL}/order-success/${order._id}`,
      },
      {
        headers: {
          Authorization: `Bearer ${WHOP_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Whop checkout creation error:", err.response?.data || err);
    throw new Error("Failed to create Whop checkout");
  }
};
