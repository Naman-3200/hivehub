import fetch from "node-fetch";
import { SHOPIFY_API_VERSION } from "./ShopifyOAuthService.js";

/* ============================= */
/* REST HELPER */
/* ============================= */
async function shopifyREST(shop, token, path, params = {}) {
  const url = new URL(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}/${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const res = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

/* ============================= */
/* GRAPHQL HELPER */
/* ============================= */
async function shopifyGraphQL(shop, token, query, variables = {}) {
  const res = await fetch(
    `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const data = await res.json();
  if (data.errors) throw new Error(JSON.stringify(data.errors));
  return data.data;
}

/* ============================= */
/* ORDERS + REVENUE */
/* ============================= */
export async function getOrdersMetrics(shop, token, start, end) {
  const orders = await shopifyREST(shop, token, "orders.json", {
    status: "any",
    created_at_min: start,
    created_at_max: end,
    limit: 250,
  });

  let revenue = 0;
  orders.orders.forEach(o => {
    revenue += Number(o.total_price || 0);
  });

  return {
    totalOrders: orders.orders.length,
    totalRevenue: revenue,
  };
}

/* ============================= */
/* VISITORS / SESSIONS */
/* ============================= */
export async function getVisitorMetrics(shop, token, start, end) {
  const query = `
    query($start: Date!, $end: Date!) {
      shop {
        analytics {
          sessions(query: "created_at >= $start AND created_at <= $end") {
            totalCount
          }
        }
      }
    }
  `;

  const data = await shopifyGraphQL(shop, token, query, {
    start,
    end,
  });

  return {
    visitors: data.shop.analytics.sessions.totalCount,
  };
}
