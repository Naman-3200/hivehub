import axios from "axios";
import User from "../model/user.model.js";
import WebProduct from "../model/webproduct.model.js";
import mongoose from "mongoose";
import StoreProduct from "../model/product.model.js";

/**
 * GET /api/products
 * Proxies CJ Dropshipping product list to the frontend using Axios
 */



// PUT /api/my-products/:productId
export const updateMyProduct = async (req, res) => {
  try {
    console.log("REQ BODY:", req.user);
console.log("REQ FILE:", req.file);

    const userId = req.user.id;
    const { productId, name, price, sellingPrice, quantity, description, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!productId ) {
      return res.status(400).json({ error: "productId is required" });
    }

    const updateFields = { name, price, sellingPrice, quantity, description, category };
    if (image) updateFields.image = image;

    const updatedUser = await User.findOneAndUpdate(
  { _id: userId, "myProducts.productId": productId },
  { $set: Object.fromEntries(Object.entries(updateFields).map(([k, v]) => [`myProducts.$.${k}`, v])) },
  { new: true }
);

await StoreProduct.findOneAndUpdate(
  { productId, userId }, // 👈 removed storeId from query
  { $set: updateFields },
  { upsert: true, new: true }
);


    console.log("Updated User:", updatedUser);

    if (!updatedUser) {
  return res.status(404).json({ error: "Product not found for this user" });
}


    res.json({ success: true, myProducts: updatedUser.myProducts });
  } catch (err) {
    console.error("Update My Product error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};



// POST /api/my-products/bulk
export const bulkAddToMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { products, storeId } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Products array is required" });
    }

    // Attach storeId + published true by default
    const normalizedProducts = products.map((p) => ({
      productId: p.productId || new mongoose.Types.ObjectId().toString(), // generate if missing
      name: p.name || "Unnamed Product",
      price: parseFloat(p.price) || 0,
      image: p.image || "https://via.placeholder.com/300x300",
      category: p.category || "General",
      storeId: storeId || null,
      published: true,
    }));

    // 1. Push into User.myProducts
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { myProducts: { $each: normalizedProducts } } },
      { new: true, select: "myProducts" }
    );

    // 2. Upsert into WebProduct collection
    for (const p of normalizedProducts) {
      await WebProduct.findOneAndUpdate(
        { productId: p.productId, storeId: p.storeId },
        { ...p, userId },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    res.json({ success: true, myProducts: updatedUser.myProducts });
  } catch (err) {
    console.error("Bulk add error:", err);
    res.status(500).json({ error: "Failed to add products in bulk" });
  }
};


export const updateTheProductStore = async (req, res) => {
  try {
    console.log("req body", req.params.productId)
    const { productId } = req.params;
    const userId = req.user.id; // comes from authenticateToken middleware
    
    const { name, description, price, image, category } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    // find product by id + user (so user can only edit their products)
    const product = await StoreProduct.find().where({ productId }).exec();

    console.log("Found product:", product);

    if (!product) {
      return res.status(401).json({ error: "Product not found"})
    }

    // update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ?? product.price;
    product.image = image || product.image;
    product.category = category || product.category;

    await product.save();

    res.json({ success: true, message: "Product updated", product });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ error: "Server error while updating product" });
  }
};

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

    const updatedUser = await WebProduct.findByIdAndUpdate(
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
