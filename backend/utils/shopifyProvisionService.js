// services/shopifyProvisionService.js
import fetch from "node-fetch"; // or use global fetch if Node >= 18

// CONFIG - replace with your values or import from env
const SHOPIFY_SHOP_DOMAIN = "ccquww-hu.myshopify.com"; // e.g. ccquww-hu.myshopify.com
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = "2025-01";

/* -----------------------
   Helper: safe REST request
   ----------------------- */
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

  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch(e) {
    // non-JSON (rare) - surface error
    throw new Error(`Shopify returned non-JSON: ${text}`);
  }
  if (!res.ok) throw new Error(`Shopify REST Error (${res.status}): ${JSON.stringify(data)}`);
  return data;
}

/* -----------------------
   Helper: GraphQL request
   ----------------------- */
async function shopifyGraphQL(query, variables = {}) {
  const url = `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(`Shopify GraphQL Error: ${JSON.stringify(json.errors)}`);
  return json.data;
}

/* -----------------------
   Theme helpers
   ----------------------- */

/**
 * Create an unpublished theme (returns theme object with id)
 */
export async function createUnpublishedTheme(themeName = "HiveHub Auto Theme") {
  const body = { theme: { name: themeName, role: "unpublished" } };
  const data = await shopifyREST("POST", "themes.json", body);
  return data.theme; // { id, name, role, created_at, ... }
}

/**
 * Upload a single asset to a theme.
 * asset: { key: 'templates/index.liquid' OR 'assets/logo.png', value: '...string...' OR src: 'https://...' }
 * If uploading binary (images), use 'src' pointing to a public URL. (Shopify accepts base64 for value but large binary via src is easier)
 */
export async function uploadThemeAsset(themeId, asset) {
  const path = `themes/${themeId}/assets.json`;
  const body = { asset };
  const data = await shopifyREST("PUT", path, body);
  // Shopify returns asset metadata for success
  return data.asset || data;
}

/**
 * Publish a theme by setting its role to "main" (the published theme).
 * Note: Shopify allows only one theme with role "main". This will set role to main and previous main becomes unpublished.
 */
export async function publishTheme(themeId) {
  const path = `themes/${themeId}.json`;
  const body = { theme: { id: themeId, role: "main" } };
  const data = await shopifyREST("PUT", path, body);
  return data.theme;
}

/* -----------------------
   Higher level provisioning
   ----------------------- */

/**
 * Main function to provision page/product/theme.
 * storeConfig: { pages: [...], products: [...], publish: true|false, themeName?: string, assets?: [{key, value/src}] }
 */
export async function provisionShopifyStoreComplete(storeConfig = {}) {
  const result = { pages: [], products: [], theme: null, warnings: [] };

  // 1) Create pages (REST)
  if (Array.isArray(storeConfig.pages)) {
    for (const p of storeConfig.pages) {
      try {
        const created = await shopifyREST("POST", "pages.json", { page: { title: p.title, body_html: p.body_html } });
        result.pages.push(created.page);
      } catch (e) {
        // do not abort entire flow for a single page error
        result.warnings.push({ type: "page", error: e.message, page: p });
      }
    }
  }

  // 2) Create products (GraphQL)
  if (Array.isArray(storeConfig.products)) {
    for (const pr of storeConfig.products) {
      try {
        const mutation = `
          mutation productCreate($input: ProductInput!) {
            productCreate(input: $input) {
              product { id title handle }
              userErrors { field message }
            }
          }
        `;
        const vars = { input: { title: pr.title, descriptionHtml: pr.descriptionHtml || "" } };
        const data = await shopifyGraphQL(mutation, vars);
        if (data.productCreate.userErrors && data.productCreate.userErrors.length)
          throw new Error(JSON.stringify(data.productCreate.userErrors));
        result.products.push(data.productCreate.product);
      } catch (e) {
        result.warnings.push({ type: "product", error: e.message, product: pr });
      }
    }
  }

  // 3) Create theme & upload assets + homepage template (if requested)
  if (storeConfig.theme && storeConfig.theme.create === true) {
    // Create unpublished theme
    const themeName = storeConfig.theme.name || `HiveHub Theme ${Date.now()}`;
    const theme = await createUnpublishedTheme(themeName);
    result.theme = theme;

    // Upload provided assets (CSS, logo) - assets is array of { key, value } or { key, src }
    if (Array.isArray(storeConfig.theme.assets)) {
      for (const a of storeConfig.theme.assets) {
        try {
          // Use uploadThemeAsset (key + value or src)
          await uploadThemeAsset(theme.id, a);
        } catch (e) {
          result.warnings.push({ type: "asset", error: e.message, asset: a });
        }
      }
    }

    // Upload a simple index template that references first created page (if exists)
    try {
      let homepageHtml = `<h1>Welcome to ${storeConfig.storeName || "Our Store"}</h1>\n<p>Auto-generated by HiveHub</p>\n`;
      // If a page was created, link to it
      if (result.pages && result.pages.length > 0) {
        const page = result.pages[0]; // first page
        // page.handle is available on created page object
        const pagePath = `/pages/${page.handle}`;
        homepageHtml += `<p><a href="${pagePath}">Visit our About page</a></p>\n`;
      }

      // Create a basic templates/index.liquid (simple)
      const indexTemplate = `
{% layout none %}
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${storeConfig.storeName || "HiveHub Store"}</title>
  </head>
  <body>
    <div class="hivehub-home">
      ${homepageHtml}
    </div>
  </body>
</html>
      `.trim();

      // Upload templates/index.liquid asset
      await uploadThemeAsset(theme.id, {
        key: "templates/index.liquid",
        value: indexTemplate
      });
    } catch (e) {
      result.warnings.push({ type: "template", error: e.message });
    }

    // 4) Finally, publish theme if requested
    if (storeConfig.theme.publish === true) {
      try {
        const published = await publishTheme(theme.id);
        result.theme = published;
      } catch (e) {
        result.warnings.push({ type: "publish", error: e.message });
      }
    }
  }

  return result;
}
