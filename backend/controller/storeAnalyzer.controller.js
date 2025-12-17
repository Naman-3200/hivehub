import Store from "../model/store.model.js";
import fetch from "node-fetch";
import { SHOPIFY_API_VERSION } from "../services/ShopifyOAuthService.js";
import crypto from "crypto";


/* ============================= */
/* ANALYZE STORE */
/* ============================= */
// export const analyzeStore = async (req, res) => {
//   try {

    
//     // const { shop } = req.query;
//     const { storeUrl, hiveStoreId } = req.body;
//     console.log("req body",req.body);
//          if (!storeUrl || !hiveStoreId) {
//       return res.status(400).json({
//         error: "Missing shop or hiveStoreId",
//       });
//     }

//         // normalize shop domain
//        const shop = storeUrl
//       .replace(/^https?:\/\//, "")
//       .replace(/\/$/, "");

//     // const store = await Store.findOne({ shopifyShop: shop });
//     const store = await Store.findById(hiveStoreId);


//     if (!store) {
//       return res.status(404).json({ message: "HiveHub store not found" });
//     }

//     // Shopify not installed yet
//     if (!store.shopifyAccessToken || store.shopifyShop !== shop) {
//       return res.status(403).json({
//         requiresInstall: true,
//         installUrl: `https://3594d1624de3.ngrok-free.app/auth/shopify/install?shop=${shop}&hiveStoreId=${hiveStoreId}`,
//       });
//     }

//     const headers = {
//       "X-Shopify-Access-Token": store.shopifyAccessToken,
//       "Content-Type": "application/json",
//     };

//     /* Orders */
//     const ordersRes = await fetch(
//       `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any`,
//       { headers }
//     );
//     const orders = await ordersRes.json();

//     let revenue = 0;
//     orders.orders.forEach(o => revenue += Number(o.total_price || 0));

//     /* Products */
//     const productsRes = await fetch(
//       `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/products.json`,
//       { headers }
//     );
//     const products = await productsRes.json();

//     res.json({
//       metrics: {
//         totalRevenue: revenue,
//         totalOrders: orders.orders.length,
//         totalProducts: products.products.length,
//       },
//       products: products.products,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to analyze store" });
//   }
// };


export const analyzeStore = async (req, res) => {
  try {
    const { storeUrl } = req.body;

    if (!storeUrl) {
      return res.status(400).json({ message: "Store URL required" });
    }

    // Normalize shop domain
    const shop = storeUrl
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");

    // Find store by shop domain
    const store = await Store.findOne({ shopifyShop: shop });

    // If app not installed
    if (!store || !store.shopifyAccessToken) {
      return res.status(403).json({
        requiresInstall: true,
        installUrl: `https://3594d1624de3.ngrok-free.app/auth/shopify/install?shop=${shop}`,
      });
    }

    const headers = {
      "X-Shopify-Access-Token": store.shopifyAccessToken,
      "Content-Type": "application/json",
    };

    // Fetch orders
    const ordersRes = await fetch(
      `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any`,
      { headers }
    );
    const ordersData = await ordersRes.json();
    const orders = ordersData.orders || [];

    let revenue = 0;
    orders.forEach(o => revenue += Number(o.total_price || 0));

    // Fetch products
    const productsRes = await fetch(
      `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/products.json`,
      { headers }
    );
    const productsData = await productsRes.json();
    const products = productsData.products || [];

    return res.json({
      metrics: {
        totalRevenue: revenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        visitors: "N/A",
      },
    });

  } catch (err) {
    console.error("Analyze store error:", err);
    res.status(500).json({ message: "Failed to analyze store" });
  }
};


/* ============================= */
/* IMPORT PRODUCT */
/* ============================= */
export const importProductToMyStore = async (req, res) => {
  try {
    const { product, myStoreId } = req.body;

    const myStore = await Store.findById(myStoreId);
    if (!myStore?.shopifyAccessToken) {
      return res.status(400).json({ message: "My store not connected" });
    }

    const response = await fetch(
      `https://${myStore.shopifyShop}/admin/api/${SHOPIFY_API_VERSION}/products.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": myStore.shopifyAccessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      }
    );

    const data = await response.json();
    res.json({ product: data.product });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to import product" });
  }
};
