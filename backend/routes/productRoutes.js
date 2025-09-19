import express from "express";
import { getProducts,addToMyProducts,getMyProducts,removeFromMyProducts,searchProducts } from "../controller/product.controller.js";
import {authenticateToken} from "../middleware/auth.middleware.js"

const router = express.Router();

// GET /api/products
router.get("/products", getProducts);
router.get("/products/search", searchProducts);


router.post("/my-products", authenticateToken, addToMyProducts);
router.get("/my-products", authenticateToken, getMyProducts);
router.delete("/my-products/:productId", authenticateToken, removeFromMyProducts);


export default router;
