// backend/controller/inventory.controller.js
import InventoryItem from "../model/inventory.model.js";
import cloudinary from "../config/cloudinary.js";
import Stream from "stream";
import Store from "../model/store.model.js";
import StoreProduct from "../model/product.model.js";
import WebProduct from "../model/webproduct.model.js";
import User from "../model/user.model.js";
import { createNotification } from "../utils/notificationService.js";


function bufferToStream(buffer) {
  const duplex = new Stream.Duplex();
  duplex.push(buffer);
  duplex.push(null);
  return duplex;
}

// Normalizes stores from FormData or JSON
function normalizeStoreIds(body) {
  // Case 1: FormData "stores[]" -> req.body.stores is array
  if (Array.isArray(body.stores)) {
    return body.stores.map((s) => String(s).trim()).filter(Boolean);
  }

  // Case 2: JSON string in "stores"
  if (typeof body.stores === "string") {
    try {
      const parsed = JSON.parse(body.stores);
      if (Array.isArray(parsed)) {
        return parsed.map((s) => String(s).trim()).filter(Boolean);
      }
      // single string fallback
      return [String(body.stores).trim()];
    } catch {
      return [String(body.stores).trim()];
    }
  }

  // Case 3: nothing provided
  return [];
}

async function uploadToCloudinary(buffer, mimetype) {
  const resourceType = mimetype.startsWith("video/") ? "video" : "image";
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "inventory" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    bufferToStream(buffer).pipe(uploadStream);
  });
}

// add to inventory.controller.js
export const listInventory = async (req, res) => {
  try {
    const ownerId = req.user._id || req.user.id;
    const items = await InventoryItem.find({ ownerId })
      .select("name sellingPrice images videos stores")
      .sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};



export const createInventory = async (req, res) => {
  try {
    const ownerId = req.user._id || req.user.id;

    const {
      name,
      description = "",
      sellingPrice = 0,
      costPrice = 0,
      category = "",
      stock = 0,
      published = false,
    } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    // ✅ Parse selected stores robustly (supports stores[] or JSON string)
    let storeIds = normalizeStoreIds(req.body);
    // De-dupe
    storeIds = [...new Set(storeIds)];

    // ✅ Upload media (images/videos)
    const images = [];
    const videos = [];
    if (Array.isArray(req.files)) {
      for (const f of req.files) {
        const uploaded = await uploadToCloudinary(f.buffer, f.mimetype);
        if (f.mimetype.startsWith("video/")) videos.push(uploaded.secure_url);
        else images.push(uploaded.secure_url);
      }
    }

    // ✅ Create the master inventory item
    const item = await InventoryItem.create({
      name,
      description,
      sellingPrice: Number(sellingPrice),
      costPrice: Number(costPrice),
      category,
      stock: Number(stock),
      published: published === true || published === "true",
      stores: storeIds,                // <-- keep mapping of where it belongs
      images,
      videos,
      ownerId,
    });

    // ✅ If published, sync to EACH selected store
    if (item.published && storeIds.length > 0) {
      const productId = item._id.toString();
      const baseDoc = {
        userId: ownerId,
        productId,
        name: item.name,
        description: item.description,
        price: item.costPrice || 0,
        sellingPrice: item.sellingPrice || 0,
        image: item.images?.[0] || "",
        category: item.category || "",
        quantity: item.stock || 0,
        published: true,
      };

      for (const raw of storeIds) {
        const sid = String(raw).trim();

        // Safety: ensure store exists (optional)
        const exists = await Store.exists({ _id: sid });
        if (!exists) continue;

        // StoreProduct (optional if you use it elsewhere)
        await StoreProduct.findOneAndUpdate(
          { productId, storeId: sid, userId: ownerId },
          { ...baseDoc, storeId: sid },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // WebProduct (drives the storefront)
        await WebProduct.findOneAndUpdate(
          { productId, storeId: sid },
          { ...baseDoc, storeId: sid },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    }


    await createNotification({
      ownerId,
      type: 'inventory',
      message: `✅ Your product "${item.name}" has been published and is live!`,
      icon: '🎯',
      meta: { productId: item._id }
    });

    return res.status(201).json({ success: true, item });
  } catch (e) {
    console.error("❌ createInventory error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};




// GET /api/inventory/:id
export const getInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id)
      .populate("stores", "name domain")
      .lean();
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, item });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/inventory/:id (multipart) - can add more media & edit fields
export const updateInventory = async (req, res) => {
  try {
    const updates = {};
    const body = req.body || {};

    // normalize booleans & numbers
    if (body.name) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.category !== undefined) updates.category = body.category;
    if (body.published !== undefined)
      updates.published = body.published === true || body.published === "true";
    if (body.sellingPrice !== undefined)
      updates.sellingPrice = Number(body.sellingPrice);
    if (body.costPrice !== undefined)
      updates.costPrice = Number(body.costPrice);
    if (body.stock !== undefined) updates.stock = Number(body.stock);
    if (body.stores !== undefined) {
      const arr = JSON.parse(body.stores || "[]");
      if (!Array.isArray(arr)) return res.status(400).json({ message: "stores must be array" });
      updates.stores = arr;
    }

    // uploads (append)
    const images = [];
    const videos = [];
    if (Array.isArray(req.files) && req.files.length) {
      for (const f of req.files) {
        const uploaded = await uploadToCloudinary(f.buffer, f.mimetype);
        if (f.mimetype.startsWith("video/")) videos.push(uploaded.secure_url);
        else images.push(uploaded.secure_url);
      }
      if (images.length) updates.$push = { ...(updates.$push || {}), images: { $each: images } };
      if (videos.length) updates.$push = { ...(updates.$push || {}), videos: { $each: videos } };
    }

    const updated = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });

    // After updating inventory item successfully:
// if (updated.published && updated.stores?.length > 0) {
//   console.log(`🔄 Syncing updated item '${updated.name}' to stores...`);
//   for (const storeId of updated.stores) {
//     await StoreProduct.findOneAndUpdate(
//       { productId: updated._id.toString(), storeId },
//       {
//         userId: updated.ownerId,
//         productId: updated._id.toString(),
//         name: updated.name,
//         image: updated.images[0] || null,
//         price: updated.sellingPrice,
//         sellingPrice: updated.sellingPrice,
//         category: updated.category,
//         quantity: updated.stock,
//         storeId,
//         published: updated.published,
//       },
//       { upsert: true, new: true }
//     );
//   }
//   console.log("✅ Store products synced successfully after update.");
// }

if (updated.published && updated.stores?.length > 0) {
  console.log(`🔄 Syncing updated item '${updated.name}' to stores...`);

  const baseDoc = {
    userId: updated.ownerId,
    productId: updated._id.toString(),
    name: updated.name,
    description: updated.description,
    price: updated.costPrice || 0,
    sellingPrice: updated.sellingPrice || 0,
    image: updated.images?.[0] || "",
    category: updated.category,
    quantity: updated.stock,
    published: updated.published,
  };

  for (const storeId of updated.stores) {
    // ✅ Update StoreProduct
    await StoreProduct.findOneAndUpdate(
      { productId: updated._id.toString(), storeId },
      { ...baseDoc, storeId },
      { upsert: true, new: true }
    );

    // ✅ Update WebProduct (THIS WAS MISSING)
    await WebProduct.findOneAndUpdate(
      { productId: updated._id.toString(), storeId },
      { ...baseDoc, storeId },
      { upsert: true, new: true }
    );
  }

  console.log("✅ Store + WebProduct synced successfully after update.");
}



if (!updated.published) {
  await StoreProduct.updateMany(
    { productId: updated._id.toString() },
    { published: false }
  );

  await WebProduct.updateMany(
    { productId: updated._id.toString() },
    { published: false }
  );

  console.log("🚫 Product unpublished from all stores (StoreProduct + WebProduct)");
}



    res.json({ success: true, item: updated });
  } catch (e) {
    console.error("updateInventory error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/inventory/:id/stores { stores: [ids] }
export const assignStores = async (req, res) => {
  try {
    const { stores } = req.body;
    if (!Array.isArray(stores)) return res.status(400).json({ message: "stores must be array" });

    const updated = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { stores },
      { new: true }
    ).populate("stores", "name domain");

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, item: updated });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};




export const createInventoryItem = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      name,
      description,
      category,
      costPrice,
      sellingPrice,
      stock,
      published,
    } = req.body;

    const storeIds = JSON.parse(req.body.stores || "[]"); // array of store IDs
    const uploadedFiles = req.files?.media || [];
    let mediaUrls = [];

    // 1️⃣ Upload each file to Cloudinary
    for (const file of uploadedFiles) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "inventory-media",
        resource_type: "auto", // handles image/video both
      });
      mediaUrls.push(result.secure_url);
      fs.unlinkSync(file.path); // cleanup
    }

    // 2️⃣ Create a productId for all stores (same across all)
    const productId = new Date().getTime().toString();

    // 3️⃣ Build the product object
    const newProduct = {
      productId,
      name,
      description,
      category,
      price: costPrice,
      sellingPrice,
      quantity: stock,
      image: mediaUrls[0] || "",
      images: mediaUrls, // optional array for multiple
      published,
    };

    // 4️⃣ Add to User.myProducts once
    await User.findByIdAndUpdate(
      userId,
      { $push: { myProducts: newProduct } },
      { new: true }
    );

    // 5️⃣ For each selected store, upsert into WebProduct
    for (const storeId of storeIds) {
      await WebProduct.findOneAndUpdate(
        { productId, storeId },
        {
          userId,
          storeId,
          ...newProduct,
          published,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // 6️⃣ Also update Store model (optional if your store shows directly from Store.publishedProducts)
      if (published) {
        await Store.findByIdAndUpdate(storeId, {
          $addToSet: {
            publishedProducts: {
              productId,
              name,
              description,
              category,
              image: mediaUrls[0] || "",
              price: costPrice,
              sellingPrice,
              quantity: stock,
            },
          },
        });
      }
    }

    res.json({
      success: true,
      message: "Inventory item created successfully",
      item: newProduct,
    });
  } catch (err) {
    console.error("❌ Inventory creation error:", err);
    res.status(500).json({ message: "Failed to create inventory item" });
  }
};