import express from "express";
import {
  generateGenProduct,
  getGenProducts,
  deleteGenProduct,
  addGenProduct,
  genNameDesForProduct,
} from "../controller/genproduct.controller.js";
import multer from "multer";
import { authenticateToken } from "../middleware/auth.middleware.js";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // you can replace this with cloud storage in prod
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const router = express.Router();

const upload = multer({ storage });


// POST → Generate new AI product
router.post("/gen-products", authenticateToken, upload.array("images", 5), generateGenProduct);

router.post("/generate-product", authenticateToken, genNameDesForProduct);


// POST → Manually add 
router.post("/add-gen-products", authenticateToken, upload.array("images", 5), addGenProduct);



// GET → Fetch all AI products
router.get("/gen-products", getGenProducts);

// DELETE → Delete specific product
router.delete("/gen-products/:id", deleteGenProduct);

export default router;
