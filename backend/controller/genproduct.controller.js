import GenProduct from "../model/genproduct.model.js";
import OpenAI from "openai";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import fetch from "node-fetch";
import { createNotification } from "../utils/notificationService.js";




const router = express.Router();
const client = new OpenAI({ apiKey: "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" });


cloudinary.config({
  cloud_name: "dp08sxzyr",
  api_key: "224272563168335",
  api_secret: "idMP342ub8UsIGv86NajShDrgtc"
});

// ✅ Generate product via AI and save
// export const generateGenProduct = async (req, res) => {
//   try {
//     const { category } = req.body;

//     if (!category) {
//       return res.status(400).json({ error: "Category is required" });
//     }

//     // 🔹 Call OpenAI GPT to generate product details
//     const completion = await client.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an AI product generator. Create a realistic product with fields: name, description, ratings (0-5 float), reviews (integer), originalPrice, sellingPrice, potentialProfit, and an image URL (use Unsplash or placeholder if not real). Return valid JSON only.",
//         },
//         {
//           role: "user",
//           content: `Generate a product in the ${category} category.`,
//         },
//       ],
//       response_format: { type: "json_object" },
//     });

//     const productData = JSON.parse(completion.choices[0].message.content);

//     // Save to DB
//     const saved = await GenProduct.create(productData);

//     res.json(saved);
//   } catch (err) {
//     console.error("❌ AI Product Generation Error:", err);
//     res.status(500).json({ error: "Failed to generate product" });
//   }
// };


export const addGenProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      ratings,
      reviews,
      originalPrice,
      sellingPrice,
      potentialProfit,
    } = req.body;

    if (!name || !category || !description || !originalPrice || !sellingPrice || !potentialProfit) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Handle image: either uploaded file or placeholder
    // const images = req.files?.map(file => `/uploads/${file.filename}`) || ["https://via.placeholder.com/300"];

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          folder: "gen-products",
        });
        imageUrls.push(uploadRes.secure_url);
        fs.unlinkSync(file.path); // cleanup
      }
    }


    const genProduct = new GenProduct({
      name,
      category,
      description,
    //   image: images,
          image: imageUrls.length > 1 ? imageUrls : imageUrls[0], // store array or string

      ratings: ratings || 0,
      reviews: reviews || 0,
      originalPrice,
      sellingPrice,
      potentialProfit,
      userId: req.user.id, // from auth middleware
    });

    await genProduct.save();

    // Notification: product added
    await createNotification({
      ownerId: req.user.id,
      type: 'inventory',
      message: `🛍️ Product "${genProduct.name}" has been added to your store.`,
      icon: '🛍️',
      meta: { productId: genProduct._id }
    });

    res.status(201).json({ message: "Product saved successfully", product: genProduct });
  } catch (err) {
    console.error("❌ Error saving gen product:", err);
    res.status(500).json({ error: "Failed to save product" });
  }
};


export const genNameDesForProduct = async (req, res) => {
  try {
    const { field, currentValue } = req.body;

    // Ask OpenAI for text
    if (field === "name" || field === "category") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${"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"}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a product description generator for e-commerce."
            },
            {
              role: "user",
              content: `Generate a ${field} for a product. Current value: ${currentValue || "none"}`
            }
          ],
          max_tokens: 100,
        }),
      });

      const data = await response.json();
      const suggestion = data.choices[0].message.content.trim();

      return res.json({ suggestion });
    }

    // Ask OpenAI for image (only when field === "image")
    if (field === "image") {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${"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"}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: currentValue || "high-quality e-commerce product image",
          n: 1,
          size: "512x512",
        }),
      });

      const data = await response.json();
      return res.json({ suggestion: data.data[0].url });
    }

    res.json({ suggestion: currentValue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
};


export const generateGenProduct = async (req, res) => {
  try {
    const { category } = req.body;
    const userId = req.user?.id;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // 🔹 Call OpenAI GPT to generate product details
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI product generator. Create a realistic product with fields: name, description, ratings (0-5 float), reviews (integer), originalPrice, sellingPrice, potentialProfit, and an image URL (use Unsplash or placeholder if not real). Return valid JSON only.",
        },
        {
          role: "user",
          content: `Generate a product in the ${category} category.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    console.log("🔹 Full AI Response:", completion);

    let rawOutput =
      completion.choices?.[0]?.message?.content ||
      completion.choices?.[0]?.message?.parsed ||
      "";

    console.log("🔹 Raw AI Output:", rawOutput);


    if (!rawOutput) {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: rawOutput,
      });
    }

  

    // 🛠 Strip extra code fences if present
    rawOutput = rawOutput.replace(/```json/gi, "").replace(/```/g, "").trim();

    let productData;
    try {
      productData = JSON.parse(rawOutput);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err.message);
      return res.status(500).json({ 
        error: "AI response was not valid JSON", 
        rawOutput 
      });
    }

    // Add category and userId to product data
    productData.category = category;
    productData.userId = userId;

    // Save to DB
    const saved = await GenProduct.create(productData);

    res.json(saved);
  } catch (err) {
    console.error("❌ AI Product Generation Error:", err);
    res.status(500).json({ error: "Failed to generate product" });
  }
};



export const getGenProducts = async (req, res) => {
  try {
    const products = await GenProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch generated products" });
  }
};

// ✅ Delete product
export const deleteGenProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await GenProduct.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
