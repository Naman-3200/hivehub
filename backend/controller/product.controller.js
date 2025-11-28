import axios from "axios";
import User from "../model/user.model.js";
import WebProduct from "../model/webproduct.model.js";
import mongoose from "mongoose";
import StoreProduct from "../model/product.model.js";
import Store from "../model/store.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import express from "express";
import OpenAI from "openai";
import InventoryItem from "../model/inventory.model.js";


const router = express.Router();
const client = new OpenAI({ apiKey: "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" });


/**
 * GET /api/products
 * Proxies CJ Dropshipping product list to the frontend using Axios
 */


cloudinary.config({
  cloud_name: "dp08sxzyr",
  api_key: "224272563168335",
  api_secret: "idMP342ub8UsIGv86NajShDrgtc"
});


// PUT /api/my-products/:productId
export const updateMyProduct = async (req, res) => {
  try {


    const userId = req.user.id;
    const { productId, name, price, description, category, sellingPrice, quantity, storeId} = req.body;
    let imageUrl;

    if (req.file) {
      // Upload to cloudinary
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "my-products"
      });
      imageUrl = uploadRes.secure_url;

      // remove local file after upload
      fs.unlinkSync(req.file.path);
    }

    if (!productId || !storeId) {
      return res.status(400).json({ error: "productId and storeId is required" });
    }

    const updateFields = { name, price, sellingPrice, quantity, description, category };
    if (storeId) updateFields.storeId = storeId;
    if (imageUrl) updateFields.image = imageUrl;

    const updatedUser = await User.findOneAndUpdate(
  { _id: userId, "myProducts.productId": productId },
  { $set: Object.fromEntries(Object.entries(updateFields).map(([k, v]) => [`myProducts.$.${k}`, v])) },
  { new: true }
);

await StoreProduct.findOneAndUpdate(
  { productId, userId, storeId }, 
  { $set: updateFields },
  { upsert: true, new: true }
);

await WebProduct.findOneAndUpdate(
  { productId, userId, storeId }, 
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
          "CJ-Access-Token": `Bearer ${process.env.CJ_TOKEN}`, // Store token in .env
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




async function fetchCJProducts() {
  try {
    const response = await axios.get(
      "https://developers.cjdropshipping.com/api2.0/v1/product/list",
      {
        params: { pageNum: 1, pageSize: 100 },
        headers: {
          "CJ-Access-Token": `Bearer ${process.env.CJ_TOKEN}`,
        },
      }
    );

    const list = response.data?.data?.list || [];

    return list.map((item) => ({
      name: item.name || "Unnamed Product",
      description: item.description || "",
      price: item.price || 0,
      image: item.productImage || null,
      category: item.category || "General",
    }));
  } catch (err) {
    console.error("❌ Failed to fetch CJ products", err.response?.data || err);
    return [];
  }
}




export const addToMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, name, price, category, storeId, sellingPrice, quantity } = req.body;
    let imageUrl;

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "my-products",
      });
      imageUrl = uploadRes.secure_url;
      fs.unlinkSync(req.file.path);
    }

    if (!productId || !storeId) {
      return res.status(400).json({ error: "productId and storeId are required" });
    }

    // ⚠️ FIX: 'mage' -> 'image'
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          myProducts: {
            productId,
            name,
            price,
            image: imageUrl, // ✅ fixed
            category,
            storeId,
            published: true,
            sellingPrice,
            quantity,
          },
        },
      },
      { new: true, select: "myProducts" }
    );

    // Sync StoreProduct
    await StoreProduct.findOneAndUpdate(
      { productId, storeId, userId },
      {
        $set: {
          userId,
          productId,
          storeId,
          name,
          price,
          image: imageUrl,
          category,
          sellingPrice,
          quantity,
          published: true,
        },
      },
      { upsert: true, new: true }
    );

    // Sync WebProduct
    await WebProduct.findOneAndUpdate(
      { productId, storeId },
      {
        $set: {
          userId,
          productId,
          storeId,
          name,
          price,
          image: imageUrl,
          category,
          sellingPrice,
          quantity,
          published: true,
        },
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, myProducts: updatedUser.myProducts });
  } catch (err) {
    console.error("Add to My Products error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};



// export const publishToWebsite = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const userId = req.user._id || req.user.id;
//     const { published, storeId } = req.body;

//     console.log("🚀 publishToWebsite called with:", {
//       productId,
//       userId,
//       published,
//       storeId,
//     });

//     if (!storeId)
//       return res.status(400).json({ message: "storeId is required" });

//     // 1️⃣ Find user and product inside myProducts array
//     const user = await User.findOneAndUpdate(
//       { _id: userId, "myProducts.productId": productId },
//       {
//         $set: {
//           "myProducts.$.published": published,
//           "myProducts.$.storeId": storeId,
//         },
//       },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User or product not found" });
//     }

//     const updatedProduct = user.myProducts.find(
//       (p) => String(p.productId) === String(productId)
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found for this user" });
//     }

//     // 2️⃣ If publishing → upsert into StoreProduct collection
//     if (published) {
//       const webProduct = await WebProduct.findOneAndUpdate(
//         { productId, storeId },
//         {
//           userId,
//           productId,
//           storeId,
//           name: updatedProduct.name || "Untitled Product",
//           price: updatedProduct.price || 0,
//           image: updatedProduct.image || "",
//           category: updatedProduct.category || "Miscellaneous",
//           quantity: updatedProduct.quantity || 0,
//           published: true,
//         },
//         { upsert: true, new: true, setDefaultsOnInsert: true }
//       );

//       console.log("✅ WebProduct synced:", webProduct._id);
//     } else {
//       // 3️⃣ Unpublishing → remove from store site
//       await WebProduct.deleteOne({ productId, storeId });
//       console.log(`🚫 Product ${productId} unpublished from store ${storeId}`);
//     }

//     // 4️⃣ (Optional) Sync to central inventory if exists
//     await InventoryItem.findByIdAndUpdate(productId, { published });

//     res.json({
//       success: true,
//       message: published ? "Product published successfully" : "Product unpublished successfully",
//     });
//   } catch (err) {
//     console.error("❌ Publish product error:", err);
//     res.status(500).json({ error: "Failed to publish product" });
//   }
// };



export const publishToWebsite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id || req.user.id;
    const { published, storeId } = req.body;

    if (!storeId) return res.status(400).json({ message: "storeId is required" });

    // 1) Update embedded product in user's myProducts
    const user = await User.findOneAndUpdate(
      { _id: userId, "myProducts.productId": productId },
      {
        $set: {
          "myProducts.$.published": published,
          "myProducts.$.storeId": storeId,
        },
      },
      { new: true, projection: { myProducts: 1 } }
    );

    if (!user) return res.status(404).json({ message: "User or product not found" });

    const updatedProduct = user.myProducts.find(p => String(p.productId) === String(productId));
    if (!updatedProduct) return res.status(404).json({ message: "Product not found for this user" });

    // 2) Canonical: upsert in WebProduct (or remove on unpublish)
    if (published) {
      await WebProduct.findOneAndUpdate(
        { productId, storeId },
        {
          $set: {
            userId,
            productId,
            storeId,
            name: updatedProduct.name || "Untitled Product",
            price: updatedProduct.price || 0,
            sellingPrice: updatedProduct.sellingPrice || updatedProduct.price || 0,
            image: updatedProduct.image || "",
            category: updatedProduct.category || "Miscellaneous",
            quantity: updatedProduct.quantity || 0,
            published: true,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // 3) Optional: keep Store.publishedProducts in sync (used by your /store/:slug page)
      await Store.findByIdAndUpdate(
        storeId,
        {
          $addToSet: {
            publishedProducts: {
              productId,
              name: updatedProduct.name || "Untitled Product",
              description: updatedProduct.description || "",
              image: updatedProduct.image || "",
              price: updatedProduct.price || 0,
              sellingPrice: updatedProduct.sellingPrice || updatedProduct.price || 0,
              category: updatedProduct.category || "",
              quantity: updatedProduct.quantity || 0,
            },
          },
        }
      );
    } else {
      await WebProduct.deleteOne({ productId, storeId });
      await Store.findByIdAndUpdate(storeId, { $pull: { publishedProducts: { productId } } });
    }

    return res.json({
      success: true,
      message: published ? "Product published successfully" : "Product unpublished successfully",
    });
  } catch (err) {
    console.error("publishToWebsite error:", err);
    res.status(500).json({ error: "Failed to publish product" });
  }
};


export const getPublishedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("myProducts");
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


export const getStorePublishedProducts = async (req, res) => {
  try {
    const { storeId } = req.params;
    if (!storeId) return res.status(400).json({ message: "storeId is required" });

    // WebProduct is our storefront source of truth
    const products = await WebProduct.find({ storeId: String(storeId), published: true }).lean();
    res.json({ products });
  } catch (e) {
    console.error("getStorePublishedProducts error:", e);
    res.status(500).json({ message: "Server error" });
  }
};




// export const getMyProducts = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("myProducts");
//     res.json({ success: true, myProducts: user.myProducts });
//   } catch (err) {
//     console.error("Get My Products error:", err);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// };

export const getMyProducts = async (req, res) => {
  try {
    // Get base list from User table
    const user = await User.findById(req.user.id).select("myProducts");
    const baseProducts = user.myProducts || [];

    // Get overrides (edited products) from StoreProduct
    const storeProducts = await StoreProduct.find({ userId: req.user.id });

    // Create a map for quick lookup of overrides by productId
    const overridesMap = {};
    storeProducts.forEach(sp => {
      overridesMap[sp.productId] = sp.toObject();
    });

    // Merge base products with overrides
    const mergedProducts = baseProducts.map(bp => {
      const override = overridesMap[bp.productId];
      if (override) {
        return {
          ...bp.toObject?.() ?? bp, // ensure plain object
          ...override, // override fields (sellingPrice, quantity, etc.)
        };
      }
      return bp.toObject?.() ?? bp;
    });

    res.json({ success: true, myProducts: mergedProducts });
  } catch (err) {
    console.error("Get My Products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};



export const removeFromMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    // 1. Remove from User.myProducts
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { myProducts: { productId } } },
      { new: true, select: "myProducts" }
    );

    // 2. Also remove from StoreProduct
    await StoreProduct.findOneAndDelete({ userId, productId });

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




export const syncToStoreProduct = async (product, storeId, userId) => {
  await WebProduct.findOneAndUpdate(
    { productId: product.productId, storeId },
    {
      userId,
      storeId,
      productId: product.productId,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: product.quantity,
      published: product.published,
    },
    { upsert: true }
  );
};
