// // backend/controllers/payment.controller.js
// import Order from "../model/order.model.js";
// import axios from "axios";
// import { v4 as uuidv4 } from "uuid"; // add this import


// const WHOP_API_KEY = "Z9qkLmDt-Ag0RJrehg6blqHnR1J6csMWCEZvYk31W78";

// export const createWhopCheckout = async (req, res) => {

// // backend/controllers/payment.controller.js
//   try {
//     const { planId } = req.body;
//     if (!planId) {
//       return res.status(400).json({ message: "planId is required" });
//     }

//     // Redirect URL after successful payment
//     const redirectUrl = "http://localhost:5173/payment-success";

//     // Generate hosted checkout link (no API key required)
//     const checkoutUrl = `https://whop.com/checkout/${planId}?redirect_url=${encodeURIComponent(
//       redirectUrl
//     )}`;

//     return res.json({ purchaseUrl: checkoutUrl });
//   } catch (err) {
//     console.error("Whop checkout redirect error:", err.message);
//     res.status(500).json({ message: "Failed to create checkout URL" });
//   }


// };







// backend/controllers/payment.controller.js
import axios from "axios";

const WHOP_API_KEY = "kts3MMnb3M-1K1wX319Yd2NLxJ2EIiSZx6OFQqGS1wM";

export const createWhopCheckout = async (req, res) => {
  try {
    const { planId, redirectUrl } = req.body;

    console.log("Received req bodyyyyyyyyyyyyyyyyyyyyyyyyyyy", req.body);

    if (!planId || typeof planId !== "string" || planId.includes("?")) {
      return res.status(400).json({ message: "Valid planId is required (no '?')." });
    }

    // Never hardcode keys. Put in .env: WHOP_API_KEY=...
 
    if (!WHOP_API_KEY) {
      return res.status(500).json({ message: "Server misconfigured: WHOP_API_KEY missing." });
    }

    // Use a sensible default redirect if frontend doesn't send one
    const successRedirect = redirectUrl || "https://whop.com";

    // Create Checkout Session (returns purchase_url)
    const { data } = await axios.post(
      "https://api.whop.com/api/v2/checkout_sessions",
      {
        plan_id: planId,            // e.g. "plan_yPQVhpq4nBFtU"
        redirect_url: successRedirect
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHOP_API_KEY}`,
        },
      }
    );

    // data.purchase_url is the link to send the customer to
    return res.json({ purchaseUrl: data.purchase_url });
  } catch (err) {
    console.error("Whop checkout session error:", err?.response?.data || err.message);
    return res.status(500).json({ message: "Failed to create checkout session" });
  }
};
