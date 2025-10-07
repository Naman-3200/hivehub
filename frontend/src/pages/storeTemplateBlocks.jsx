export const getStoreBlocks = (store, publishedProducts) => {
  // HERO SECTION
  const heroSection = `
    <section class="hero-gradient text-white py-20" data-gjs-type="hero-block">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold mb-4">Welcome to ${store?.name}</h2>
        <p class="text-xl mb-8">${store?.description || `Your trusted ${store?.category} store with amazing products!`}</p>
        <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Shop Now</a>
      </div>
    </section>
  `;

  // PRODUCTS SECTION
  const productsGrid =
    publishedProducts.length === 0
      ? `
        <section id="products" class="py-16 text-center">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h3>
          <p class="text-gray-600">We're adding amazing products to our store. Check back soon!</p>
        </section>`
      : `
        <section id="products" class="py-16" data-gjs-type="product-grid">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Products</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              ${publishedProducts
                .map(
                  (product) => `
                <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
                  <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" />
                  <div class="p-6">
                    <h3 class="font-semibold text-gray-900 mb-2">${product.name}</h3>
                    <p class="text-gray-600 text-sm mb-3">${product.description}</p>
                    <div class="flex items-center justify-between mb-3">
                      <div>
                        <span class="text-lg font-bold text-gray-900">$₹${Number(product.sellingPrice || product.price || 0).toFixed(2)}</span>
                      </div>
                    </div>
                    <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Add to Cart</button>
                  </div>
                </div>`
                )
                .join("")}
            </div>
          </div>
        </section>
      `;

  // FOOTER SECTION
  const footerSection = `
    <footer class="bg-gray-900 text-white py-12" data-gjs-type="footer-block">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <p>📧 info@${store.name.toLowerCase().replace(/\s+/g, "")}.com</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>📍 123 Business St, City, State</p>
          </div>
        </div>
      </div>
    </footer>
  `;

  return { heroSection, productsGrid, footerSection };
};
