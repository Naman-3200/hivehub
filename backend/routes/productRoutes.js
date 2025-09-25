import express from "express";
import { getProducts,addToMyProducts,getMyProducts,removeFromMyProducts,searchProducts, publishToWebsite, getPublishedProducts } from "../controller/product.controller.js";
import {authenticateToken} from "../middleware/auth.middleware.js"
import { createStore, getStores } from "../controller/store.controller.js";

const router = express.Router();

// GET /api/products
router.get("/products", getProducts);
router.get("/products/search", searchProducts);
router.put("/publish-to-website/:productId", authenticateToken, publishToWebsite);




router.post("/my-products", authenticateToken, addToMyProducts);
router.get("/my-products", authenticateToken, getMyProducts);
router.delete("/my-products/:productId", authenticateToken, removeFromMyProducts);


export default router;
