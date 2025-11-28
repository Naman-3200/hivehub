import express from "express";
import fetch from "node-fetch";
import { buildInstallUrl, verifyHMAC, SHOPIFY_API_KEY, SHOPIFY_API_SECRET } from "../services/ShopifyOAuthService.js";
import ShopifyStore from "../model/shopify.model.js";
import Store from "../model/store.model.js"; // your existing HiveHub store model
import { provisionShopifyStore } from "../services/ShopifyProvisionService.js";

const router = express.Router();

/**
 * STEP 1: Frontend calls this to get install URL
 * GET /auth/shopify/install?shop=store-domain.myshopify.com&hiveStoreId=...
 */
router.get("/install", async (req, res) => {
  const { shop, hiveStoreId } = req.query;
  if (!shop || !hiveStoreId) {
    return res.status(400).json({ error: "Missing shop or hiveStoreId" });
  }

  // you can also verify hiveStoreId belongs to current user here
  const stateObj = {
    hiveStoreId,
    nonce: Date.now().toString(36),
  };
  const state = Buffer.from(JSON.stringify(stateObj)).toString("base64url");

  const installUrl = buildInstallUrl(shop, state);
  // DEBUG LOG: what URL is actually being sent to Shopify
  console.log("🔥 Shopify INSTALL URL GENERATED:", installUrl);
  return res.json({ installUrl });
});

/**
 * STEP 2: Shopify redirects here after merchant approves app
 * GET /auth/shopify/callback
 */
router.get("/callback", async (req, res) => {
  try {
    const { shop, code, state } = req.query;

    if (!verifyHMAC(req.query)) {
      return res.status(400).send("HMAC validation failed");
    }

    const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
    const { hiveStoreId } = decoded;

    // Exchange code for access token
    const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
        code,
      }),
    });
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;

    // Save mapping in DB (upsert in case they reconnect)
    const hiveStore = await Store.findById(hiveStoreId);
    if (!hiveStore) return res.status(400).send("HiveHub store not found");

    await ShopifyStore.findOneAndUpdate(
      { shop },
      {
        shop,
        accessToken,
        hiveStoreId: hiveStore._id,
        ownerId: hiveStore.ownerId.toString(),
        installedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Provision Shopify (pages/products)
    // await provisionShopifyStore(shop, accessToken, hiveStore.name);
    await provisionShopifyStore(shop, accessToken, hiveStore);


    // mark HiveHub store as connected
    hiveStore.shopifyShop = shop;
    hiveStore.shopifyConnected = true;
    await hiveStore.save();

    // Redirect to frontend success page
    // e.g. https://hivehub-tr8u.vercel.app/shopify-connected?shop=...&storeId=...
    const frontendUrl = `https://hivehub-tr8u.vercel.app/shopify-connected?shop=${encodeURIComponent(
      shop
    )}&storeId=${hiveStoreId}`;
    return res.redirect(frontendUrl);
  } catch (err) {
    console.error("Shopify OAuth callback error:", err);
    return res.status(500).send("Shopify auth error");
  }
});

export default router;
