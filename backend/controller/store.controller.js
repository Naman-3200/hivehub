import Store from "../model/store.model.js";
import WebProduct from "../model/webproduct.model.js";
import fetch from "node-fetch";
import axios from "axios";
import StoreProduct from "../model/product.model.js";
import { createNotification } from "../utils/notificationService.js";
import { provisionShopifyStoreComplete } from "../utils/shopifyProvisionService.js";
import dotenv from "dotenv";
dotenv.config();





const projectIdOrName = "prj_hfmrjkbcAy7C7C1CWhm22JEFvQSo"; // your Vercel project identifier
const teamId = "team_v8WBStmlyWkuytkpGMcQBeD2"; // optional
const token = "YXwvRmVm8yKQI5BZlgSJuQ6m";

// 🔥 Hardcode these based on what you gave me
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const SHOPIFY_SHOP_DOMAIN = "ccquww-hu.myshopify.com"; 
const API_VERSION = "2025-01"; 





export const toggleStoreStatus = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { disable } = req.body;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Prevent disabling Superadmin-owned stores
    if (store.ownerId?.role === "superadmin") {
      return res.status(403).json({ message: "Cannot disable superadmin's store" });
    }

    store.disabled = disable;
    await store.save();

    res.status(200).json({
      message: `Store ${disable ? "disabled" : "enabled"} successfully.`,
      store,
    });
  } catch (error) {
    console.error("Error toggling store:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// GET store by ID (with published products)
export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find store
    const store = await Store.findById(id);
if (!store || store.disabled) {
  return res.status(403).json({ message: "This store is currently disabled." });
}



    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // 2️⃣ Find published products for that store
    const publishedProducts = await WebProduct.find({
      storeId: id,
      published: true,
    });

    // 3️⃣ Respond with both store + published products
    // res.status(200).json({
    //   store,
    //   publishedProducts,
    // });

   res.status(200).json({
      success: true,
      store: {
        _id: store._id,
        name: store.name,
        domain: store.domain,
        customDomain: store.customDomain,
        domainVerified: store.domainVerified,
        websiteHtml: store.websiteHtml || "",
        websiteCss: store.websiteCss || "",
      },
      publishedProducts,
    });
  } catch (error) {
    console.error("Error fetching store data:", error);
    res.status(500).json({ error: "Server error while fetching store" });
  }
};

function generateWebsiteContent(store, publishedProducts) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${store.name} - Online Store</title>
    <style>
    .hero-gradient {
  background: linear-gradient(180deg, #4f46e5 0%, #3b82f6 100%);
  min-height: 60vh;
}

        .product-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
        .hero-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    </style>
</head>
<body class="bg-white">
    <header class="bg-transparent absolute top-0 left-0 w-full z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <h1 class="text-2xl font-bold text-gray-900">${store.name}</h1>
                    <span class="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">${store.category}</span>
                </div>
                <nav class="flex space-x-8">
                    <a href="#products" class="text-gray-600 hover:text-gray-900">Products</a>
                    <div id="cart-indicator" class="relative">
                        <span class="text-gray-600">🛒</span>
                        <span id="cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center hidden">0</span>
                    </div>
                </nav>
            </div>
        </div>
    </header>
    <section class="hero-gradient text-white py-28 relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-4xl font-bold mb-4">Welcome to ${store.name}</h2>
            <p class="text-xl mb-8">${store.description || `Your trusted ${store.category} store with amazing products!`}</p>
            <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Shop Now</a>
        </div>
    </section>
    <section id="products" class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Products</h2>
            
            ${publishedProducts.length === 0 ? `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">📦</div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
                    <p class="text-gray-600">We're adding amazing products to our store. Check back soon!</p>
                </div>
            ` : `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    ${publishedProducts.map(product => `
                        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
                            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" onerror="this.src='https://via.placeholder.com/300x300/4F46E5/white?text=Product'">
                            <div class="p-6">
                                <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${product.name}</h3>
                                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
                                <div class="flex items-center justify-between mb-3">
                                    <div>
                                      <span class="text-lg font-bold text-gray-900">
                                        $${Number(product.sellingPrice || product.price || 0).toFixed(2)}
                                      </span>
                                      ${product.price
                                        ? `<span class="ml-2 text-sm text-gray-500 line-through">$${Number(product.price).toFixed(2)}</span>`
                                        : ''}
                                    </div>

                                </div>
                                <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" data-product-name="${product.name}" data-product-price="${Number(product.sellingPrice || product.price).toFixed(2)}">Add to Cart</button>
                                <div class="mt-3 flex items-center">
                                    <div class="flex items-center">
                                        ${Array(5).fill(0).map((_, i) => `<svg class="w-4 h-4 ${i < Math.floor(product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`).join('')}
                                    </div>
                                    <span class="ml-2 text-sm text-gray-600">(${product.reviews || 0})</span>
                                </div>
                                ${product.isFreeShipping ? '<div class="mt-2"><span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Free Shipping</span></div>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    </section>
    <script>
        let cart = [];
        const cartCountElement = document.getElementById('cart-count');
        
        function updateCartCount() {
            const count = cart.length;
            if (count > 0) {
                cartCountElement.textContent = count;
                cartCountElement.classList.remove('hidden');
            } else {
                cartCountElement.classList.add('hidden');
            }
        }
        
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart-btn')) {
                e.preventDefault();
                const productName = e.target.dataset.productName;
                const productPrice = e.target.dataset.productPrice;
                
                cart.push({name: productName, price: productPrice});
                
                e.target.textContent = 'Added!';
                e.target.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                e.target.classList.add('bg-green-600');
                
                updateCartCount();
                
                setTimeout(() => {
                    e.target.textContent = 'Add to Cart';
                    e.target.classList.remove('bg-green-600');
                    e.target.classList.add('bg-blue-600', 'hover:bg-blue-700');
                }, 2000);
                
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                toast.textContent = \`Added "\${productName}" to cart!\`;
                document.body.appendChild(toast);
                
                setTimeout(() => toast.remove(), 3000);
            }
        });
    </script>
        
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4">${store.name}</h3>
                    <p class="text-gray-400">Your trusted online ${store.category} store.</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#products" class="hover:text-white">Products</a></li>
                        <li><a href="#about" class="hover:text-white">About Us</a></li>
                        <li><a href="#contact" class="hover:text-white">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Support</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">Help Center</a></li>
                        <li><a href="#" class="hover:text-white">Returns</a></li>
                        <li><a href="#" class="hover:text-white">Shipping Info</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Contact Info</h4>
                    <div class="text-gray-400 space-y-2">
                        <p>📧 info@${store.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                        <p>📞 +1 (555) 123-4567</p>
                        <p>📍 123 Business St, City, State</p>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 ${store.name}. All rights reserved. | Powered by DropShip Pro</p>
            </div>
        </div>
    </footer>
</body>
            </html>`;
}


export const storeProduct = async (req, res) => {
  try {
    const { storeId } = req.params;
    const products = await StoreProduct.find({ storeId, published: true });

    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching store products:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// export const getStoreWebsiteHTML = async (req, res) => {
//   try {
//     const { storeId } = req.params;

//     const store = await Store.findById(storeId);
//     if (!store) {
//       return res.status(404).json({ error: "Store not found" });
//     }

//     const products = await WebProduct.find({
//       storeId: store._id,
//       published: true,
//     });

//     const html = generateWebsiteContent(store, products);

//     res.set("Content-Type", "text/html");
//     return res.status(200).send(html);
//   } catch (err) {
//     console.error("Error generating store HTML:", err);
//     res.status(500).json({ error: "Failed to generate HTML" });
//   }
// };


// export const getStoreWebsiteHTML = async (req, res) => {
//   try {
//     const { storeId } = req.params;
//     const store = await Store.findById(storeId);
//     if (!store) return res.status(404).send("Store not found");

//     // If custom HTML exists, show it
//     if (store.websiteHtml && store.websiteHtml.trim().length > 0) {
//       res.set("Content-Type", "text/html");
//       return res.status(200).send(store.websiteHtml);
//     }

//     // ✅ Query by storeId String
//     const products = await WebProduct.find({
//       storeId: String(store._id),
//       published: true,
//     }).lean();

//     const html = generateWebsiteContent(store, products);
//     res.set("Content-Type", "text/html");
//     return res.status(200).send(html);
//   } catch (err) {
//     console.error("Error generating store HTML:", err);
//     return res.status(500).json({ error: "Failed to generate HTML" });
//   }
// };


// ✅ Controller to return both store data + published WebProducts
export const getStorePublishedProducts = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });

    // Fetch published products from WebProduct collection
    const products = await WebProduct.find({
      storeId: String(store._id),
      published: true,
    }).lean();

    return res.status(200).json({
      success: true,
      store,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("❌ getStorePublishedProducts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch published products",
      error: error.message,
    });
  }
};


export const getStoreWebsiteHTML = async (req, res) => {
  try {
    const { storeId } = req.params;
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).send("Store not found");

    // ✅ If you already have saved HTML
    // if (store.websiteHtml && store.websiteHtml.trim().length > 0) {
    //   res.set("Content-Type", "text/html");
    //   return res.status(200).send(store.websiteHtml);
    // }

    // ✅ FIXED: fetch from StoreProduct instead of WebProduct
    // Try WebProduct first, fallback to StoreProduct if empty
let products = await WebProduct.find({
  storeId: String(store._id),
  published: true,
}).lean();

// fallback if WebProduct empty
if (!products.length) {
  products = await StoreProduct.find({
    storeId: String(store._id),
    published: true,
  }).lean();
}

const html = generateWebsiteContent(store, products);

    res.set("Content-Type", "text/html");
    return res.status(200).send(html);
  } catch (err) {
    console.error("Error generating store HTML:", err);
    return res.status(500).json({ error: "Failed to generate HTML" });
  }
};

export const getSlugStore = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find store by domain containing slug
    const store = await Store.findOne({ domain: { $regex: slug, $options: "i" } });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Fetch products linked to this store
    const products = await WebProduct.find({ storeId: store._id, published: true });

    res.status(200).json({
      success: true,
      store: {
        _id: store._id,
        name: store.name,
        domain: store.domain,
        customDomain: store.customDomain,
        category: store.category,
        description: store.description,
        domainVerified: store.domainVerified,
        websiteHtml: store.websiteHtml || "",
        websiteCss: store.websiteCss || "",
      },
      publishedProducts: products,
    });
  } catch (err) {
    console.error("Get store error:", err);
    res.status(500).json({ error: "Failed to fetch store" });
  }
}


// Use Vercel API to add a domain to the Vercel project
async function addDomainToVercel(domain) {

  const res = await fetch(
    `https://api.vercel.com/v10/projects/${projectIdOrName}/domains?teamId=${teamId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: domain,
        // optionally redirect, gitBranch, etc.
      }),
    }
  );
  const data = await res.json();
  return data;
}

export const editStore = async (req, res) => {

try {
    const { storeId } = req.params;
    const { customDomain } = req.body;
    console.log("🟡 Incoming domain update:", { storeId, customDomain });

    if (!storeId || !customDomain) {
      return res.status(400).json({ error: "storeId and customDomain are required" });
    }

    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ error: "Store not found" });

    // Step 1: Add domain to Vercel
    const vercelRes = await axios.post(
      `https://api.vercel.com/v10/projects/${projectIdOrName}/domains`,
      { name: customDomain },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("🟢 Domain added to Vercel:", vercelRes.data);

    // Step 2: Verify the domain
    try {
      const verifyRes = await axios.post(
        `https://api.vercel.com/v9/domains/${customDomain}/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("🟢 Domain verified on Vercel:", verifyRes.data);

      // Step 3: Update store in DB
      store.customDomain = customDomain;
      store.domainVerified = true;
      await store.save();

      return res.status(200).json({
        message: "Domain added and verified successfully",
        domain: customDomain,
      });
    } catch (verifyErr) {
      console.error("🔴 Domain verification failed:", verifyErr.response?.data || verifyErr.message);

      store.customDomain = customDomain;
      store.domainVerified = false;
      await store.save();

      return res.status(200).json({
        message:
          "Domain added but verification pending. Please ensure DNS is set up correctly.",
        domain: customDomain,
      });
    }
  } catch (err) {
    console.error("🔴 Vercel API error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to add domain", details: err.message });
  }
  
};

// Create store
// export const createStore = async (req, res) => {
//   try {
//       console.log("Create store request body:", req.body);
//     const { name, url } = req.body;
//     const domain = url
//     const ownerId = req.user.id; // comes from auth middleware
//     console.log("Owner ID from token:", ownerId);

//     const newStore = new Store({ name, domain, ownerId });
//     await newStore.save();

//      // Notification
//     await createNotification({
//       ownerId,
//       type: 'store',
//       message: `🎉 Your store "${newStore.name}" has been created successfully!`,
//       icon: '🏪',
//       meta: { storeId: newStore._id }
//     });

//     res.status(201).json({ success: true, store: newStore });
//   } catch (error) {
//     console.error("Error creating store:", error);
//     res.status(500).json({ success: false, message: "Failed to create store" });
//   }
// };

// export const getStores = async (req, res) => {
//   try {
//     console.log("Fetching stores for user ID:", req.user.id);
//     const stores = await Store.find({ ownerId: req.user.id });
//     res.json({ success: true, stores });
//   } catch (error) {
//     console.error("Error fetching stores:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch stores" });
//   }
// };




async function debugShopifyREST(method, path, body = null) {
  const url = `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API_VERSION}/${path}`;
  console.log("\n\n==============================");
  console.log("DEBUG REST CALL →", url);
  console.log("METHOD:", method);
  console.log("BODY:", JSON.stringify(body, null, 2));
  console.log("==============================");

  const res = await fetch(url, {
    method,
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await res.text();

  console.log("STATUS:", res.status, res.statusText);
  console.log("RAW RESPONSE:");
  console.log(text);
  console.log("HEADERS:", {
    "x-request-id": res.headers.get("x-request-id"),
    "x-shopify-api-version": res.headers.get("x-shopify-api-version"),
    "content-type": res.headers.get("content-type")
  });

  console.log("==============================\n\n");

  return {
    status: res.status,
    text
  };
}





/****************************
 * SHOPIFY HELPER FUNCTIONS
 ****************************/

// REST Request
async function shopifyREST(method, path, body = null) {
  const url = `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API_VERSION}/${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  // Read text first (so we can debug non-JSON responses)
  const text = await res.text();

  let data = null;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    console.error("❌ Shopify returned non-JSON response:");
    console.error(text);
    throw new Error(`Shopify unexpected response (non-JSON). Status=${res.status}`);
  }

  if (!res.ok) {
    console.error("❌ Shopify REST ERROR:", data);
    throw new Error(`Shopify REST Error: ${JSON.stringify(data)}`);
  }

  return data;
}


// GraphQL Request
async function shopifyGraphQL(query, variables = {}) {
  const res = await fetch(
    `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, variables })
    }
  );

  const data = await res.json();
  if (data.errors) throw new Error(`Shopify GraphQL Error: ${JSON.stringify(data.errors)}`);
  return data.data;
}


/*********************************************
 * AUTO-PROVISION SHOPIFY WEBSITE WHEN STORE CREATED
 *********************************************/
async function provisionShopifyWebsite(storeName, storeUrl) {
  const result = {};

  // 1️⃣ Create Page
  const pagePayload = {
    page: {
      title: "Welcome",
      body_html: `<h1>${storeName}</h1><p>Auto-generated by HiveHub.</p>`
    }
  };

  const createdPage = await shopifyREST("POST", "pages.json", pagePayload);
  result.page = createdPage.page;



  // 2️⃣ Create Product (GraphQL works fine)
  const productMutation = `
    mutation createProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product { id title handle }
        userErrors { field message }
      }
    }
  `;

  const productVars = {
    input: {
      title: `${storeName} Default Product`,
      descriptionHtml: `<p>Auto created for ${storeName}</p>`
    }
  };

  const productRes = await shopifyGraphQL(productMutation, productVars);
  if (productRes.productCreate.userErrors.length > 0)
    throw new Error(JSON.stringify(productRes.productCreate.userErrors));

  result.product = productRes.productCreate.product;



// 3️⃣ Create Navigation Menu (correct REST endpoint)
const menuPayload = {
  navigation_menu: {
    title: "Main menu",
    handle: "main-menu",
    items: [
      { title: "Home", type: "url", url: "/" },
      { title: "Welcome", type: "url", url: "/pages/welcome" }
    ]
  }
};

// const createdMenu = await shopifyREST(
//   "POST",
//   "online_store/navigation_menus.json",
//   menuPayload
// );


await debugShopifyREST("GET", "navigation_menus.json");
await debugShopifyREST("GET", "online_store/navigation_menus.json");
await debugShopifyREST("GET", "menus.json");
await debugShopifyREST("GET", "online_store/menus.json");
await debugShopifyREST("GET", "online_store/navigation.json");
await debugShopifyREST("GET", "navigation.json");


// result.menu = createdMenu.navigation_menu;




  // OPTIONAL: 4️⃣ Theme from ZIP (skip)
  // const themePayload = {
  //   theme: {
  //     name: "HiveHub Theme",
  //     src: "https://your-bucket/theme.zip",
  //     role: "unpublished"
  //   }
  // };
  // const themeRes = await shopifyREST("POST", "themes.json", themePayload);
  // result.theme = themeRes.theme;

  return result;
}



/****************************
 *  CREATE STORE CONTROLLER
 ****************************/
// export const createStore = async (req, res) => {
//   try {
//     console.log("Create store request body:", req.body);

//     const { name, url } = req.body;
//     const ownerId = req.user.id;

//     // 1️⃣ Create store inside HiveHub DB
//     const newStore = new Store({ name, domain: url, ownerId });
//     await newStore.save();

//     // 2️⃣ Auto-create Shopify Website
//     console.log("Provisioning Shopify website...");
//     const shopifyProvision = await provisionShopifyWebsite(name, url);

//     // Save provision result inside the store record
//     newStore.shopifyProvision = shopifyProvision;
//     await newStore.save();

//     // 3️⃣ Notification
//     await createNotification({
//       ownerId,
//       type: "store",
//       message: `🎉 Your store "${newStore.name}" is live and Shopify site is auto-generated!`,
//       icon: "🏪",
//       meta: { storeId: newStore._id }
//     });

//     res.status(201).json({
//       success: true,
//       store: newStore,
//       shopify: shopifyProvision
//     });

//   } catch (error) {
//     console.error("Error creating store:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create store",
//       error: error.message
//     });
//   }
// };




// export const createStore = async (req, res) => {
//   try {
//     const { name, url } = req.body;
//     const ownerId = req.user.id;

//     const newStore = new Store({ name, domain: url, ownerId });
//     await newStore.save();

//     // Build config for provisioning
//     const config = {
//       storeName: name,
//       pages: [
//         { title: "Welcome", body_html: `<h1>${name}</h1><p>Auto-generated by HiveHub.</p>` },
//         { title: "About", body_html: `<h2>About ${name}</h2><p>Created automatically.</p>` }
//       ],
//       products: [
//         { title: `${name} Default Product`, descriptionHtml: `<p>Auto created for ${name}</p>` }
//       ],
//       theme: {
//         create: true,       
//         publish: true,      
//         name: `${name} HiveHub Theme`,
//         assets: [
//           { key: "assets/hivehub.css", value: "body { font-family: Arial, sans-serif; }" }
//         ]
//       }
//     };

//     const shopifyResult = await provisionShopifyStoreComplete(config);

//     newStore.shopifyProvision = shopifyResult;
//     await newStore.save();

//     res.status(201).json({
//       success: true,
//       store: newStore,
//       shopify: shopifyResult
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

export const createStore = async (req, res) => {
  try {
    const { name, category, domain, url, description } = req.body;
    const ownerId = req.user.id;

    const newStore = new Store({
      name,
      category,
      ownerId,
      domain,      
      url,               
      description: description || "",
      shopifyConnected: false,
    });

    await newStore.save();

    res.status(201).json({
      success: true,
      store: newStore,
    });
  } catch (err) {
    console.error("Error creating store:", err);
    res.status(500).json({ success: false, message: "Failed to create store" });
  }
};






/****************************
 * GET STORES
 ****************************/
export const getStores = async (req, res) => {
  try {
    const stores = await Store.find({ ownerId: req.user.id });
    console.log("admin shop toen", SHOPIFY_ADMIN_TOKEN);
    res.json({ success: true, stores });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stores"
    });
  }
};



export const updateWebsite = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { websiteHtml, websiteCss, publishedProducts } = req.body;

    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ error: "Store not found" });

    if (websiteHtml !== undefined) store.websiteHtml = websiteHtml;
    if (websiteCss !== undefined) store.websiteCss = websiteCss;
    if (publishedProducts !== undefined) store.publishedProducts = publishedProducts;

    await store.save();
    return res.json({ success: true, store });

  } catch (err) {
    console.error("Error saving HTML:", err);
    res.status(500).json({ error: "Server error" });
  }
};




// GET /api/stores/:storeId/published-products
export const listPublishedProductsForStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    // prefer WebProduct as the canonical source
    const products = await WebProduct.find(
      { storeId, published: true },
      // only the fields your site needs
      { productId: 1, name: 1, price: 1, sellingPrice: 1, image: 1, category: 1, quantity: 1, _id: 0 }
    ).lean();

    return res.json({ products });
  } catch (e) {
    console.error("listPublishedProductsForStore error:", e);
    res.status(500).json({ message: "Server error" });
  }
};
