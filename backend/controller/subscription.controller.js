import axios from "axios";
import User from "../model/user.model.js";

const WHOP_API_KEY = "iXhX284W5UMZgUi17DlSy_i_feZgAiMlFPcxjP1rKis";

export const createWhopCheckout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { planId } = req.body; // this should be your Whop PLAN_ID, not product

    // ✅ Fetch user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Create Whop checkout session using plan_id
    const response = await axios.post(
      "https://api.whop.com/api/v2/checkout_sessions",
      {
        plan_id: planId, // 👈 correct key
        redirect_url: "https://whop.com",
        cancel_url: "http://localhost:5173/dashboard?cancelled=true",
        metadata: {
          userId: userId.toString(),
          email: user.email,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHOP_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Response contains purchase_url
    return res.json({
      success: true,
      checkoutUrl: response.data.purchase_url,
    });
  } catch (err) {
    console.error(
      "Whop checkout creation failed:",
      err.response?.data || err.message
    );
    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
    });
  }
};
