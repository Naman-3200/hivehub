import express from "express";
import { getProducts } from "../controller/product.controller.js";

const router = express.Router();

// GET /api/products
router.get("/products", getProducts);

export default router;
