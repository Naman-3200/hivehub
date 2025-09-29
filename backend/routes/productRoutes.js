import express from "express";
import { getProducts,addToMyProducts,getMyProducts,removeFromMyProducts,searchProducts, publishToWebsite, getPublishedProducts, bulkAddToMyProducts, updateMyProduct, updateTheProductStore } from "../controller/product.controller.js";
import {authenticateToken} from "../middleware/auth.middleware.js"
import multer from "multer";
import Product from "../model/product.model.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });



const router = express.Router();

// GET /api/products
router.get("/products", getProducts);
router.get("/products/search", searchProducts);
router.put("/publish-to-website/:productId", authenticateToken, publishToWebsite);
router.put("/my-products/update", authenticateToken, upload.single("image"), updateMyProduct);
router.put("/my-products/:productId", authenticateToken, updateTheProductStore);



// router.put("/my-products/:productId", authenticateToken, updateMyProduct);
router.post("/my-products/bulk", authenticateToken, bulkAddToMyProducts);
router.post("/my-products", authenticateToken, addToMyProducts);
router.get("/my-products", authenticateToken, getMyProducts);
router.delete("/my-products/:productId", authenticateToken, removeFromMyProducts);

router.get("/debug/products", async (req, res) => {
  try {
    const products = await Product.find({}, "_id name userId storeId");
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
