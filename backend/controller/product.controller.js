import axios from "axios";

/**
 * GET /api/products
 * Proxies CJ Dropshipping product list to the frontend using Axios
 */
export const getProducts = async (req, res) => {
  try {
    // Allow optional pageNum & pageSize query parameters
    const pageNum = req.query.pageNum || 1;
    const pageSize = req.query.pageSize || 50;

    const response = await axios.get(
      "https://developers.cjdropshipping.com/api2.0/v1/product/list",
      {
        params: { pageNum, pageSize },
        headers: {
          "CJ-Access-Token": process.env.CJ_TOKEN, // Store token in .env
          "Content-Type": "application/json",
        },
        timeout: 15000, // optional timeout (15 sec)
      }
    );

    // Forward CJ API response to frontend
    res.json(response.data);
  } catch (err) {
    console.error("CJ proxy error:", err.message);
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.message || "Server error fetching CJ products";
    res.status(status).json({ error: message });
  }
};
