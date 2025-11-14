import React from "react";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  ChevronDown,
  Search,
  Star,
  Loader
} from "lucide-react";

const ProductsPage = ({
  selectedStore,
  setSelectedStore,
  openDropdown,
  setOpenDropdown,
  setShowProductModal,
  setProductMode,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  loading,
  error,
  currentProducts,
  newArrivals,
  userId,
  fetchProducts,
  setSelectedProduct,
  setIsEditing,
  setViewProductModal
}) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col px-8 py-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-10 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            🛍️ Products
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {selectedStore
              ? `Add products to ${selectedStore.name}`
              : "Select a store to manage its inventory"}
          </p>
        </div>

        {/* Add Product Dropdown */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setOpenDropdown(prev => !prev)}
            className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
          >
            <span className="font-medium">+ Add Product</span>
            <ChevronDown className="ml-2 w-4 h-4" />
          </button>

          {openDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 z-50 animate-fadeIn">
              <button
                onClick={() => {
                  setProductMode("manual");
                  setShowProductModal(true);
                  setOpenDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-t-xl transition-colors"
              >
                ✏️ Manual
              </button>

              <button
                onClick={() => {
                  setProductMode("ai");
                  setShowProductModal(true);
                  setOpenDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-b-xl transition-colors"
              >
                🤖 AI
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg rounded-2xl p-5 max-w-7xl mx-auto mb-10">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
          <div className="flex flex-wrap gap-3">
            {[
              { id: "trending", label: "Trending", icon: TrendingUp },
              { id: "revenue", label: "Revenue Based", icon: DollarSign },
              { id: "new", label: "New Arrivals", icon: Calendar },
              { id: "myprod", label: "My Products", icon: Calendar }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* My Generated Products (AI) */}
      {activeTab === "myprod" && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {newArrivals.filter(p => p.userId === userId).length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-12 bg-white/60 rounded-xl shadow">
              You haven’t added any products yet.
            </p>
          ) : (
            newArrivals
              .filter(p => p.userId === userId)
              .map(product => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <img
                    src={Array.isArray(product.image) ? product.image[0] : product.image}
                    alt={product.name}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.sellingPrice}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    </div>

                    <p className="text-green-600 text-sm mt-1">
                      Profit: ${product.potentialProfit}
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-16 text-gray-600">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          Loading products...
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 font-semibold mb-4">
            ⚠️ Error loading products
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        /* Product Grid */
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentProducts.map(product => (
            <div
              key={product.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
              />

              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    ({product.reviews})
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsEditing(false);
                    setViewProductModal(true);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow hover:shadow-lg transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
