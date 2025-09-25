import axios from "axios";
import User from "../model/user.model.js";
import WebProduct from "../model/webproduct.model.js";
import mongoose from "mongoose";

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
    const { productId, name, price, image, category, storeId } = req.body;

    if (!productId || !storeId) {
      return res.status(400).json({ error: "productId and storeId are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { myProducts: { productId, name, price, image, category, storeId, published: true } } },
      { new: true, select: "myProducts" }
    );

    // 2. Add/Update in WebProduct collection
    await WebProduct.findOneAndUpdate(
      { productId, storeId },
      {
        $set: {
          userId,
          productId,
          storeId,
          name,
          price,
          image,
          category,
          published: true
        }
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, myProducts: updatedUser.myProducts });
  } catch (err) {
    console.error("Add to My Products error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

// controllers/productController.js
export const publishToWebsite = async (req, res) => {
  try {
    const productIdParam = req.params.productId;

    const userFromToken = req.user.id;
    const { published, storeId } = req.body;

    console.log("publishToWebsite called with:", {
      productIdParam,
      userFromToken,
      published,
      storeId
    });

    const user = await User.findOneAndUpdate(
      { _id: userFromToken, "myProducts.productId": productIdParam },
      {
        $set: {
          "myProducts.$.published": published,
          "myProducts.$.storeId": storeId
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User or product not found" });
    }

    const updatedProduct = user.myProducts.find(
      (p) => p.productId.toString() === productIdParam.toString()
    );

     // 2. Add/Update in WebProduct table
    // 2. Add/Update in WebProduct table
if (published) {
  const webProduct = await WebProduct.findOneAndUpdate(
    { productId: productIdParam, storeId: storeId || null }, // match
    {
      userId: userFromToken,
      productId: productIdParam,
      storeId: storeId || null,
      name: updatedProduct?.name || "",
      price: updatedProduct?.price || 0,
      image: updatedProduct?.image || "",
      category: updatedProduct?.category || "",
      published: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("WebProduct entry created/updated:", webProduct);
} else {
  // If unpublishing → remove
  await WebProduct.deleteOne({ productId: productIdParam, storeId: storeId || null });
}


    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    console.error("Publish product error:", err);
    res.status(500).json({ error: "Failed to publish product" });
  }
};


export const getPublishedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(userId).select("myProducts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const publishedProducts = user.myProducts.filter(p => p.published);

    res.status(200).json({ products: publishedProducts });
  } catch (err) {
    console.error("Error fetching published products:", err);
    res.status(500).json({ message: "Internal server error" });
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
