import WebProduct from "../model/webproduct.model.js";
import mongoose from "mongoose";


// PUT /api/publish-to-website/:productId
export const publishToWebsite = async (req, res) => {
  const { productId } = req.params;
  const { published } = req.body;
  
  console.log("Current user from token:", req.user.id); // Backend
  console.log(req.body, req.params, req.user, "requestsssss");
  
  try {
    console.log("Looking for product with:", {
      productId: req.params.productId,
      userId: req.user.id,
    });
    
    // Only search by productId
    const product = await WebProduct.findOneAndUpdate(
      { productId: productId, userId: req.user.id },
      { published },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json({
      message: "Product publish status updated successfully",
      product,
    });
  } catch (err) {
    console.error("Error publishing product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};