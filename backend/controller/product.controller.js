import axios from "axios";
import User from "../model/user.model.js";

/**
 * GET /api/products
 * Proxies CJ Dropshipping product list to the frontend using Axios
 */
export const getProducts = async (req, res) => {
  try {
    // Allow optional pageNum & pageSize query parameters
    const pageNum = req.query.pageNum || 1;
    const pageSize = req.query.pageSize || 200;

    const response = await axios.get(
      "https://developers.cjdropshipping.com/api2.0/v1/product/list",
      {
        params: { pageNum, pageSize },
        headers: {
          "CJ-Access-Token": process.env.CJ_TOKEN, // Store token in .env
          "Content-Type": "application/json",
        },
        timeout: 15000, // optional timeout (15 sec)
      }
    );

    // Forward CJ API response to frontend
    res.json(response.data);
  } catch (err) {
    console.error("CJ proxy error:", err.message);
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.message || "Server error fetching CJ products";
    res.status(status).json({ error: message });
  }
};

export const addToMyProducts = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { productId, name, price, image, category } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { myProducts: { productId, name, price, image, category } } },
      { new: true, select: "myProducts" }
    );

    res.json({ success: true, myProducts: updatedUser.myProducts });
  } catch (err) {
    console.error("Add to My Products error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("myProducts");
    res.json({ success: true, myProducts: user.myProducts });
  } catch (err) {
    console.error("Get My Products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// DELETE /api/my-products/:productId
export const removeFromMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params; // productId from URL

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { myProducts: { productId } } },
      { new: true, select: "myProducts" }
    );

    res.json({ success: true, myProducts: updatedUser.myProducts });
  } catch (err) {
    console.error("Remove from My Products error:", err);
    res.status(500).json({ error: "Failed to remove product" });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q, pageNum = 1, pageSize = 50 } = req.query;
    if (!q) return res.status(400).json({ error: "Search query is required" });

    const response = await axios.get(
      "https://developers.cjdropshipping.com/api2.0/v1/product/list",
      {
        params: { productName: q, pageNum, pageSize },
        headers: {
          "CJ-Access-Token": process.env.CJ_TOKEN,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("CJ search error:", err.message);
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.message || "Server error searching CJ products";
    res.status(status).json({ error: message });
  }
};
