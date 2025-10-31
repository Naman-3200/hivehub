// backend/controller/inventory.controller.js
import InventoryItem from "../model/inventory.model.js";
import cloudinary from "../config/cloudinary.js";
import Stream from "stream";
import Store from "../model/store.model.js";
import StoreProduct from "../model/product.model.js";


function bufferToStream(buffer) {
  const duplex = new Stream.Duplex();
  duplex.push(buffer);
  duplex.push(null);
  return duplex;
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


// POST /api/inventory (multipart/form-data)
// fields: name, description, sellingPrice, costPrice, category, stock, stores (JSON[]), published
// export const createInventory = async (req, res) => {
//   try {
//     const ownerId = req.user._id || req.user.id;

//     // parse scalar + array fields (multipart -> strings)
//     const {
//       name,
//       description = "",
//       sellingPrice = 0,
//       costPrice = 0,
//       category = "",
//       stock = 0,
//       published = false,
//       stores = "[]",
//     } = req.body;

//     if (!name) return res.status(400).json({ message: "name is required" });

//     const storeIds = JSON.parse(stores || "[]");
//     if (!Array.isArray(storeIds)) {
//       return res.status(400).json({ message: "stores must be an array" });
//     }

//     const images = [];
//     const videos = [];

//     if (Array.isArray(req.files)) {
//       for (const f of req.files) {
//         const uploaded = await uploadToCloudinary(f.buffer, f.mimetype);
//         if (f.mimetype.startsWith("video/")) videos.push(uploaded.secure_url);
//         else images.push(uploaded.secure_url);
//       }
//     }

//     // optional: verify store IDs exist
//     if (storeIds.length) {
//       const exists = await Store.find({ _id: { $in: storeIds } }).select("_id");
//       if (exists.length !== storeIds.length) {
//         return res.status(400).json({ message: "One or more stores not found" });
//       }
//     }

//     const item = await InventoryItem.create({
//       name,
//       description,
//       sellingPrice: Number(sellingPrice),
//       costPrice: Number(costPrice),
//       category,
//       stock: Number(stock),
//       published: published === true || published === "true",
//       stores: storeIds,
//       images,
//       videos,
//       ownerId,
//     });

//     res.status(201).json({ success: true, item });
//   } catch (e) {
//     console.error("createInventory error:", e);
//     res.status(500).json({ message: "Server error" });
//   }
// };


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
      stores = "[]",
    } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const storeIds = JSON.parse(stores || "[]");
    if (!Array.isArray(storeIds)) {
      return res.status(400).json({ message: "stores must be an array" });
    }

    // upload media
    const images = [];
    const videos = [];
    if (Array.isArray(req.files)) {
      for (const f of req.files) {
        const uploaded = await uploadToCloudinary(f.buffer, f.mimetype);
        if (f.mimetype.startsWith("video/")) videos.push(uploaded.secure_url);
        else images.push(uploaded.secure_url);
      }
    }

    // create the master inventory product
    const item = await InventoryItem.create({
      name,
      description,
      sellingPrice: Number(sellingPrice),
      costPrice: Number(costPrice),
      category,
      stock: Number(stock),
      published: published === true || published === "true",
      stores: storeIds,
      images,
      videos,
      ownerId,
    });

    // ✅ Sync to each store’s live products if published
    if (item.published && storeIds.length > 0) {
      console.log(`📦 Syncing published item '${item.name}' to ${storeIds.length} store(s)...`);

      for (const storeId of storeIds) {
        await StoreProduct.findOneAndUpdate(
          { productId: item._id.toString(), storeId },
          {
            userId: ownerId,
            productId: item._id.toString(),
            name: item.name,
            image: item.images[0] || null,
            price: item.sellingPrice,
            sellingPrice: item.sellingPrice,
            category: item.category,
            quantity: item.stock,
            storeId,
            published: true,
          },
          { upsert: true, new: true }
        );
      }

      console.log("✅ Product synced to all stores successfully.");
    }

    res.status(201).json({ success: true, item });
  } catch (e) {
    console.error("❌ createInventory error:", e);
    res.status(500).json({ message: "Server error" });
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
if (updated.published && updated.stores?.length > 0) {
  console.log(`🔄 Syncing updated item '${updated.name}' to stores...`);
  for (const storeId of updated.stores) {
    await StoreProduct.findOneAndUpdate(
      { productId: updated._id.toString(), storeId },
      {
        userId: updated.ownerId,
        productId: updated._id.toString(),
        name: updated.name,
        image: updated.images[0] || null,
        price: updated.sellingPrice,
        sellingPrice: updated.sellingPrice,
        category: updated.category,
        quantity: updated.stock,
        storeId,
        published: updated.published,
      },
      { upsert: true, new: true }
    );
  }
  console.log("✅ Store products synced successfully after update.");
}

if (!updated.published) {
  await StoreProduct.updateMany(
    { productId: updated._id.toString() },
    { published: false }
  );
  console.log("🚫 Product unpublished from all stores");
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

