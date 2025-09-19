"use client";

import { useState, useMemo, useEffect } from "react";
import "./ProductDashboard.css";

const ProductDashboard = () => {
  const [activeTab, setActiveTab] = useState("all-products");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [myProducts, setMyProducts] = useState([]);
  const [allProductsData, setAllProductsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;
   

  // 🔑 NEW: load saved products for the logged-in user
  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:8000/api/my-products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch My Products");
      const data = await res.json();
      setMyProducts(data.myProducts || []);
    } catch (err) {
      console.error("Error fetching My Products:", err);
    }
  };


  /** Search CJ products from backend */
const searchCJProducts = async (query) => {
  if (!query) return fetchProducts(); // fallback to default products

  setLoading(true);
  setError(null);
  try {
    const res = await fetch(`http://localhost:8000/api/products/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (!data?.data?.list) throw new Error("Invalid API response");

    const mappedProducts = data.data.list.map((item, index) => ({
      id: item.pid || `product-${index}`,
      name: item.productNameEn || item.productName || "Unknown Product",
      price: parseFloat(item.sellPrice?.split(" -- ")[0] || "0"),
      rating: Math.random() * 2 + 3,
      reviews: Math.floor(Math.random() * 1000) + 50,
      category: item.categoryName || "General",
      image: item.productImage || "/placeholder.svg",
      trending: Math.random() > 0.7,
      bestseller: Math.random() > 0.8,
      sku: item.productSku,
      weight: item.productWeight,
      isFreeShipping: item.isFreeShipping,
    }));

    setAllProductsData(mappedProducts);
    setCurrentPage(1);
  } catch (err) {
    console.error("CJ Search error:", err);
    setError(err.message);
    setAllProductsData([]);
  } finally {
    setLoading(false);
  }
};


  /** Fetch products from your backend proxy */
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/products");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (!data?.data?.list) throw new Error("Invalid API response structure");

      const mappedProducts = data.data.list.map((item, index) => ({
        id: item.pid || `product-${index}`,
        name: item.productNameEn || item.productName || "Unknown Product",
        price: parseFloat(item.sellPrice?.split(" -- ")[0] || "0"),
        rating: Math.random() * 2 + 3,
        reviews: Math.floor(Math.random() * 1000) + 50,
        category: item.categoryName || "General",
        image: item.productImage || "/placeholder.svg",
        trending: Math.random() > 0.7,
        bestseller: Math.random() > 0.8,
        sku: item.productSku,
        weight: item.productWeight,
        isFreeShipping: item.isFreeShipping,
      }));

      setAllProductsData(mappedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
      setAllProductsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMyProducts(); // 🔑 NEW
  }, []);

  useEffect(() => {
  const handler = setTimeout(() => {
    if (searchTerm) {
      searchCJProducts(searchTerm);
    } else {
      fetchProducts();
    }
  }, 700); // 700ms debounce

  return () => clearTimeout(handler);
}, [searchTerm]);

  /** Filter + search + sort products */
  const filteredProducts = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    let filtered = allProductsData.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );

    switch (sortBy) {
      case "expensive":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "cheap":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "trending":
        filtered = filtered.filter((p) => p.trending);
        break;
      case "bestseller":
        filtered = filtered.filter((p) => p.bestseller);
        break;
      default:
        break;
    }
    return filtered;
  }, [allProductsData, searchTerm, sortBy]);

  /** Pagination */
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /** 🔑 NEW: Add product to backend + local state */
  const addToMyProducts = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in");
        return;
      }
      const res = await fetch("http://localhost:8000/api/my-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
        }),
      });
      if (!res.ok) throw new Error("Failed to add product");
      const data = await res.json();
      setMyProducts(data.myProducts || []);
    } catch (err) {
      console.error("Add to My Products error:", err);
      alert(err.message);
    }
  };

  /** (optional) local remove remains the same if you keep the button */
  const removeFromMyProducts = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`http://localhost:8000/api/my-products/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to remove product");
    const data = await res.json();
    setMyProducts(data.myProducts || []);
  } catch (err) {
    console.error("Remove error:", err);
    alert(err.message);
  }
};


  /** Stars */
  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    for (let i = 0; i < full; i++) stars.push(<span key={`f${i}`} className="star filled">★</span>);
    if (half) stars.push(<span key="half" className="star half">★</span>);
    while (stars.length < 5) stars.push(<span key={`e${stars.length}`} className="star empty">★</span>);
    return stars;
  };

  /** Card component */
  const ProductCard = ({ product, showAddButton = true }) => (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.trending && <span className="badge trending">🔥 Trending</span>}
        {product.bestseller && <span className="badge bestseller">👑 Bestseller</span>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        {product.sku && <p className="product-sku">SKU: {product.sku}</p>}
        <div className="product-rating">
          {renderStars(product.rating)}
          <span className="rating-text">({product.reviews})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price}</span>
          {showAddButton ? (
            <button
              className="add-button"
              onClick={() => addToMyProducts(product)}
              disabled={!!myProducts.find((p) => p.id === product.id)}
            >
              {myProducts.find((p) => p.id === product.id) ? "Added" : "Add"}
            </button>
          ) : (
            <button
              className="remove-button"
              onClick={() => removeFromMyProducts(product.id)}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );

  /** JSX */
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Product Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "my-products" ? "active" : ""}`}
            onClick={() => setActiveTab("my-products")}
          >
            📦 My Products <span className="count">{myProducts.length}</span>
          </button>
          <button
            className={`nav-item ${activeTab === "all-products" ? "active" : ""}`}
            onClick={() => setActiveTab("all-products")}
          >
            🛍️ All Products <span className="count">{allProductsData.length}</span>
          </button>
        </nav>
      </div>

      {/* Main */}
      <div className="main-content">
        {activeTab === "all-products" ? (
          <div className="all-products">
            <div className="page-header">
              <h1>All Products</h1>
              <p>Discover and add products to your collection</p>
              <button
                onClick={fetchProducts}
                disabled={loading}
                className="refresh-button"
              >
                {loading ? "Loading..." : "Refresh Products"}
              </button>
            </div>

            {error && (
              <div className="error-message">
                <p>Error loading products: {error}</p>
                <p>Please try refreshing.</p>
              </div>
            )}

            {/* Search + Filter */}
            <div className="controls">
              <input
  type="text"
  placeholder="Search products..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="search-input"
/>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
              >
                <option value="all">All Products</option>
                <option value="expensive">Most Expensive</option>
                <option value="cheap">Least Expensive</option>
                <option value="trending">Trending</option>
                <option value="bestseller">Bestseller</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-state"><p>Loading products…</p></div>
            ) : (
              <>
                <div className="products-grid">
                  {paginatedProducts.length === 0 ? (
                    <div className="empty-state">
                      <p>
                        No products found.{" "}
                        {error
                          ? "Please check your connection."
                          : "Try adjusting search or filters."}
                      </p>
                    </div>
                  ) : (
                    paginatedProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="my-products">
            <div className="page-header">
              <h1>My Products</h1>
              <p>Products you've added to your collection</p>
            </div>
            {myProducts.length === 0 ? (
              <div className="empty-state">
                <p>No products added yet. Browse all products to add some!</p>
              </div>
            ) : (
              <div className="products-grid">
                {myProducts.map((p) => (
<ProductCard key={p.productId} product={{ ...p, id: p.productId }} showAddButton={false} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDashboard;
