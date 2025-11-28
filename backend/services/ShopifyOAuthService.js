import crypto from "crypto";
import querystring from "querystring";

export const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
export const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
export const APP_HOST = process.env.APP_HOST;
export const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-01";

export function buildInstallUrl(shop, state) {
  const scopes = [
    "read_products","write_products",
    "read_themes","write_themes",
    "read_online_store_pages","write_online_store_pages",
    "read_content","write_content",
    "write_files"
  ].join(",");

  const redirectUri = `${APP_HOST}/auth/shopify/callback`;

  return `https://${shop}/admin/oauth/authorize?` +
    `client_id=${SHOPIFY_API_KEY}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(state)}`;
}

// verify HMAC in callback
export function verifyHMAC(query) {
  const { hmac, ...rest } = query;
  const message = querystring.stringify(
    Object.keys(rest).sort().reduce((o, k) => {
      o[k] = rest[k];
      return o;
    }, {})
  );

  const digest = crypto
    .createHmac("sha256", SHOPIFY_API_SECRET)
    .update(message)
    .digest("hex");

  return digest === hmac;
}
