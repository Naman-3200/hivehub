"use client"

import { useState, useMemo, useEffect } from "react"
import "./ProductDashboard.css"

const ProductDashboard = () => {
  const [activeTab, setActiveTab] = useState("all-products")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [myProducts, setMyProducts] = useState([])
  const [allProductsData, setAllProductsData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const itemsPerPage = 6

  const API_CONFIG = {
    url: "https://developers.cjdropshipping.com/api2.0/v1/product/list",
    token:
      "API@CJ4729719@CJ:eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyNzg2OCIsInR5cGUiOiJBQ0NFU1NfVE9LRU4iLCJzdWIiOiJicUxvYnFRMGxtTm55UXB4UFdMWnl0aWluQitmUjVpTEsrY2ZFMEtOYUVCVzdIRzUvV2k4dFEvbUxmakVNY2VHcE42QmRybUI3VWNuaXRaZkZrNHNueDdld3FHVzlSNFFxYWhaem1zdWY3S1I5ZEJFRERVNGpYOTdoSDZROEoyQVJHendGZDNINzhMYWsvKytqbDZTdHJXckVNd1B2NnBHSk95a0U4LzlXVyszTjZQb3pMRVRmbEUybEo4VUs0TU9PV2lvSStuZ0RrS2ZTNGliMG9vWmRNKzNHQ3hWaGlDMHFxZ1VLZUN4NGkrZ2JDNGVhZ2ZYUFI1YU9SNFNURzA2L2xGYnBTMVE0cGdYTXJnd0FqTDBGTW4zUUlOY3h4VHUzWFZIaGNiZ09Rc2NrVFhiQnU5bHhWUkliL0lTUGszViIsImlhdCI6MTc1ODIxMzg1Mn0.zudPpvy-2zemFN4SF_lncN7gYw5JOtfu6sO7hJ9kNxs",
  }

  // const fetchProducts = async (pageNum = 1, pageSize = 50) => {
  //   setLoading(true)
  //   setError(null)

  //   try {
  //     const response = await fetch(`${API_CONFIG.url}?pageNum=${pageNum}&pageSize=${pageSize}`, {
  //       method: "GET",
  //       headers: {
  //         "CJ-Access-Token": API_CONFIG.token,
  //         "Content-Type": "application/json",
  //       },
  //     })

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`)
  //     }

  //     const data = await response.json()

  //     if (data.result && data.data && data.data.list) {
  //       const mappedProducts = data.data.list.map((item, index) => ({
  //         id: item.pid || `product-${index}`,
  //         name: item.productNameEn || item.productName || "Unknown Product",
  //         price: Number.parseFloat(item.sellPrice?.split(" -- ")[0] || "0"),
  //         rating: Math.random() * 2 + 3, // Random rating between 3-5 since API doesn't provide
  //         reviews: Math.floor(Math.random() * 1000) + 50, // Random reviews
  //         category: item.categoryName || "General",
  //         image: item.productImage || "/placeholder.svg",
  //         trending: Math.random() > 0.7, // Random trending status
  //         bestseller: Math.random() > 0.8, // Random bestseller status
  //         sku: item.productSku,
  //         weight: item.productWeight,
  //         isFreeShipping: item.isFreeShipping,
  //       }))

  //       setAllProductsData(mappedProducts)
  //     } else {
  //       throw new Error("Invalid API response structure")
  //     }
  //   } catch (err) {
  //     console.error("Error fetching products:", err)
  //     setError(err.message)
  //     setAllProductsData([])
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchProducts = async (pageNum = 1, pageSize = 50) => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(`http://localhost:8000/api/products`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // same mapping as before
    if (data.result && data.data && data.data.list) {
      const mappedProducts = data.data.list.map((item, index) => ({
        id: item.pid || `product-${index}`,
        name: item.productNameEn || item.productName || "Unknown Product",
        price: Number.parseFloat(item.sellPrice?.split(" -- ")[0] || "0"),
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
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    setError(err.message);
    setAllProductsData([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = allProductsData.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    switch (sortBy) {
      case "expensive":
        filtered = filtered.sort((a, b) => b.price - a.price)
        break
      case "cheap":
        filtered = filtered.sort((a, b) => a.price - b.price)
        break
      case "trending":
        filtered = filtered.filter((product) => product.trending)
        break
      case "bestseller":
        filtered = filtered.filter((product) => product.bestseller)
        break
      default:
        break
    }

    return filtered
  }, [allProductsData, searchTerm, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const addToMyProducts = (product) => {
    if (!myProducts.find((p) => p.id === product.id)) {
      setMyProducts([...myProducts, product])
    }
  }

  const removeFromMyProducts = (productId) => {
    setMyProducts(myProducts.filter((p) => p.id !== productId))
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>,
      )
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>,
      )
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <span key={i} className="star empty">
          ★
        </span>,
      )
    }
    return stars
  }

  const ProductCard = ({ product, showAddButton = true }) => (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image || "/placeholder.svg"} alt={product.name} />
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
              disabled={myProducts.find((p) => p.id === product.id)}
            >
              {myProducts.find((p) => p.id === product.id) ? "Added" : "Add"}
            </button>
          ) : (
            <button className="remove-button" onClick={() => removeFromMyProducts(product.id)}>
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )

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
            <span className="nav-icon">📦</span>
            My Products
            <span className="count">{myProducts.length}</span>
          </button>
          <button
            className={`nav-item ${activeTab === "all-products" ? "active" : ""}`}
            onClick={() => setActiveTab("all-products")}
          >
            <span className="nav-icon">🛍️</span>
            All Products
            <span className="count">{allProductsData.length}</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === "all-products" ? (
          <div className="all-products">
            <div className="page-header">
              <h1>All Products</h1>
              <p>Discover and add products to your collection</p>
              <button onClick={() => fetchProducts()} disabled={loading} className="refresh-button">
                {loading ? "Loading..." : "Refresh Products"}
              </button>
            </div>

            {error && (
              <div className="error-message">
                <p>Error loading products: {error}</p>
                <p>Please try refreshing to load products from the API.</p>
              </div>
            )}

            {/* Search and Filter Controls */}
            <div className="controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-container">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                  <option value="all">All Products</option>
                  <option value="expensive">Most Expensive</option>
                  <option value="cheap">Least Expensive</option>
                  <option value="trending">Trending</option>
                  <option value="bestseller">Bestseller</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <p>Loading products...</p>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="products-grid">
                  {paginatedProducts.length === 0 && !loading ? (
                    <div className="empty-state">
                      <p>
                        No products found.{" "}
                        {error
                          ? "Please check your connection and try again."
                          : "Try adjusting your search or filters."}
                      </p>
                    </div>
                  ) : (
                    paginatedProducts.map((product) => <ProductCard key={product.id} product={product} />)
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
                {myProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showAddButton={false} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDashboard
