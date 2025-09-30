import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const StorePage = () => {
  const { slug } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/stores/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch store");
        const data = await res.json();
        setStoreData(data.store);
      } catch (err) {
        console.error("Error fetching store:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [slug]);


  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);

    // Temporary button feedback
    const button = document.getElementById(`btn-${product.productId}`);
    if (button) {
      button.textContent = "Added!";
      button.classList.remove("bg-blue-600", "hover:bg-blue-700");
      button.classList.add("bg-green-600");

      setTimeout(() => {
        button.textContent = "Add to Cart";
        button.classList.remove("bg-green-600");
        button.classList.add("bg-blue-600", "hover:bg-blue-700");
      }, 2000);
    }

    // Toast message
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
    toast.textContent = `Added "${product.name}" to cart!`;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  };

  if (loading) return <p className="p-6">Loading store...</p>;
  if (!storeData) return <p className="p-6">Store not found.</p>;

    // const publishedProducts = storeData.products?.filter((p) => p.published) || [];
    const publishedProducts =
  storeData.products?.filter((p) => p.published && p.quantity > 0) || [];


  return (
    // <div className="p-6">
    //   <h1 className="text-2xl font-bold">{storeData.name}</h1>
    //   <p className="text-gray-600">{storeData.domain}</p>

    //   {/* Products */}
    //   <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    //     {storeData.products?.length > 0 ? (
    //       storeData.products.map((p) => (
    //         <div
    //           key={p.productId}
    //           className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
    //         >
    //           <img
    //             src={p.image}
    //             alt={p.name}
    //             className="h-40 w-full object-cover rounded-md mb-3"
    //           />
    //           <h2 className="text-lg font-semibold">{p.name}</h2>
    //           <p className="text-sm text-gray-500">{p.category}</p>
    //           <p className="mt-2 font-bold">${p.sellingPrice ?? p.price}</p>
    //           <p className="text-xs text-gray-400">Stock: {p.quantity}</p>
    //         </div>
    //       ))
    //     ) : (
    //       <p className="text-gray-500">No products available.</p>
    //     )}
    //   </div>
    // </div>
   
<div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{storeData.name}</h1>
              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
                {storeData.category}
              </span>
            </div>
            <nav className="flex space-x-8">
              <a href="#products" className="text-gray-600 hover:text-gray-900">
                Products
              </a>
              <div className="relative">
                <span className="text-gray-600">🛒</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-gradient text-white py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to {storeData.name}</h2>
          <p className="text-xl mb-8">
            {storeData.description ||
              `Your trusted ${storeData.category} store with amazing products!`}
          </p>
          <a
            href="#products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Products
          </h2>

          {publishedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Coming Soon!
              </h3>
              <p className="text-gray-600">
                We're adding amazing products to our store. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {publishedProducts.map((product) => (
                <div
                  key={product.productId}
                  className="product-card bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300x300/4F46E5/white?text=Product")
                    }
                  />
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ${product.sellingPrice || product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      id={`btn-${product.productId}`}
                      onClick={() => addToCart(product)}
                      className="add-to-cart-btn w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{storeData.name}</h3>
              <p className="text-gray-400">
                Your trusted online {storeData.category} store.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#products" className="hover:text-white">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Shipping Info
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="text-gray-400 space-y-2">
                <p>
                  📧 info@
                  {storeData.name.toLowerCase().replace(/\s+/g, "")}.com
                </p>
                <p>📞 +1 (555) 123-4567</p>
                <p>📍 123 Business St, City, State</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} {storeData.name}. All rights
              reserved. | Powered by DropShip Pro
            </p>
          </div>
        </div>
      </footer>
    </div>

  );
};

export default StorePage;
