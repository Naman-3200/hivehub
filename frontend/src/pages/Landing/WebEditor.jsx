// src/pages/Landing/WebEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import gjsPresetWebpage from "grapesjs-preset-webpage"; // install if you want: npm i grapesjs-preset-webpage

const WebEditor = () => {
  const location = useLocation();
  const { storeId } = useParams();
  // get passed state from navigate() if available
  const { store: navStore, publishedProducts: navProducts } = location.state || {};

  // we'll prefer navigation state, else we'll fetch (fallback)
  const [store, setStore] = useState(navStore || null);
  const [stores, setStores] = useState([]);
  console.log("stores stores", stores)
  const [publishedProducts, setPublishedProducts] = useState(navProducts || []);
  const editorContainerRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const token = localStorage.getItem("token"); // adjust if you store token elsewhere


  // If user reloads /builder/:storeId, fetch store from backend
  useEffect(() => {
    if (!navStore && storeId) {
      (async () => {
        try {
          const res = await fetch(`http://localhost:8000/api/stores/${storeId}`);
          const data = await res.json();
          if (res.ok) {
            setStore(data.store);
            setPublishedProducts(data.store?.publishedProducts || []);
          } else {
            console.error("Failed to fetch store:", data);
          }
        } catch (err) {
          console.error("Fetch store error:", err);
        }
      })();
    }
  }, [navStore, storeId]);

  // Single GrapesJS initialization + localStorage cleanup
  useEffect(() => {
    if (!editorContainerRef.current) return;
    // Cleanup any corrupted saved project keys (fixes the 'elevate""' error)
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("gjs"))
        .forEach((k) => {
          const v = localStorage.getItem(k);
          if (v && (v.includes('elevate""') || v.includes("elevate"))) {
            console.warn("Removing corrupted GrapesJS localStorage key:", k);
            localStorage.removeItem(k);
          }
        });
    } catch (err) {
      console.warn("Error checking gjs localStorage:", err);
    }

    // Initialize GrapesJS once
    if (editorInstanceRef.current) return;

    const editor = grapesjs.init({
      container: editorContainerRef.current,
      height: "100vh",
      width: "auto",
      fromElement: false,
      storageManager: {
        type: "local",
        autosave: true,
        autoload: false, // safer: don't autoload potentially corrupted state
      },
      plugins: [gjsPresetWebpage],
      pluginsOpts: {
        [gjsPresetWebpage]: {},
      },
      // important: load Tailwind inside the editor iframe
      canvas: {
        styles: [
          // If you have a compiled Tailwind CSS hosted, prefer that URL here.
          // We include tailwind via script below too to support dynamic utilities.
        ],
        scripts: [
          "https://cdn.tailwindcss.com", // ensures Tailwind runs inside iframe
        ],
      },
    });

    // Add a lightweight top toolbar for device switching and basic actions
    const pn = editor.Panels;
    // create container before #gjs so toolbar sits above editor
    const topBar = document.createElement("div");
    topBar.className = "gjs-topbar flex justify-between items-center p-2 bg-gray-100 border-b";
    topBar.innerHTML = `
      <div class="panel__devices flex gap-2"></div>
      <div class="panel__options flex gap-2"></div>
      <div class="panel__views flex gap-2"></div>
    `;
    editorContainerRef.current.before(topBar);

    pn.addPanel({ id: "devices-panel", el: ".panel__devices" });
    pn.addPanel({ id: "options-panel", el: ".panel__options" });
    pn.addPanel({ id: "views-panel", el: ".panel__views" });

    pn.getPanel("devices-panel").get("buttons").add([
      { id: "device-desktop", className: "btn-device", label: "Desktop", command: () => editor.setDevice("Desktop"), active: true },
      { id: "device-tablet", className: "btn-device", label: "Tablet", command: () => editor.setDevice("Tablet") },
      { id: "device-mobile", className: "btn-device", label: "Mobile", command: () => editor.setDevice("Mobile") },
    ]);

    pn.getPanel("options-panel").get("buttons").add([
      { id: "undo", label: "Undo", command: "core:undo" },
      { id: "redo", label: "Redo", command: "core:redo" },
      { id: "clear", label: "Clear", command: () => editor.runCommand("core:canvas-clear") },
    ]);

    pn.getPanel("views-panel").get("buttons").add([
      { id: "open-blocks", label: "Blocks", command: "open-blocks", togglable: true },
      { id: "open-layers", label: "Layers", command: "open-layers", togglable: true },
      { id: "open-styles", label: "Styles", command: "open-style-manager", togglable: true },
      { id: "open-traits", label: "Traits", command: "open-traits", togglable: true },
    ]);

    editorInstanceRef.current = editor;
    setIsReady(true);

    // small visual background inside canvas body so sections don't float on white
    editor.on("load", () => {
      try {
        const iframeBody = editor.Canvas.getBody();
        if (iframeBody) iframeBody.style.backgroundColor = "#f8fafc"; // tailwind gray-50 like
      } catch (e) {
        // ignore
      }
    });

    return () => {
      try {
        editor.destroy();
      } catch (e) {}
      editorInstanceRef.current = null;
    };
  }, []);

  // Helper: extract body innerHTML and head styles from saved full HTML (if any)
  const extractBodyAndHeadStyles = (rawHtml) => {
    if (!rawHtml) return { bodyHtml: "", headStyle: "" };
    // If the rawHtml looks like a full document, parse it
    try {
      if (/<html[\s\S]*>/i.test(rawHtml)) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, "text/html");
        const bodyHtml = doc.body ? doc.body.innerHTML : rawHtml;
        // collect style tags from head
        let headStyle = "";
        doc.head && doc.head.querySelectorAll("style").forEach((s) => {
          headStyle += s.innerHTML + "\n";
        });
        return { bodyHtml, headStyle };
      } else {
        // not a full doc, treat as body content only
        return { bodyHtml: rawHtml, headStyle: "" };
      }
    } catch (err) {
      console.warn("HTML parse failed, falling back to raw HTML:", err);
      return { bodyHtml: rawHtml, headStyle: "" };
    }
  };

  // When editor is ready and store data available, load content safely
  useEffect(() => {
    if (!isReady) return;
    if (!editorInstanceRef.current) return;

    const editor = editorInstanceRef.current;

    // prefer the latest store (from state), fallback to navStore
    const currentStore = store || navStore;
    const currentProducts = publishedProducts?.length ? publishedProducts : navProducts || [];

    // Build raw HTML to load: prefer explicit store.websiteHtml; else generate
    const rawHtml = currentStore?.websiteHtml && currentStore.websiteHtml.trim() !== ""
      ? currentStore.websiteHtml
      : generateWebsiteContent(currentStore || { name: "My Store", category: "" }, currentProducts);

    // Extract possible <style> content embedded in saved websiteHtml (if saved as full doc)
    const { bodyHtml, headStyle } = extractBodyAndHeadStyles(rawHtml);

    // The editor may also have CSS stored separately (websiteCss)
    const savedCss = currentStore?.websiteCss || "";

    // Combined CSS that we will set inside the editor
    const combinedCss = (headStyle ? headStyle + "\n" : "") + savedCss;

    try {
      // set components (body markup) and set style (css)
      editor.setComponents(bodyHtml);
      if (combinedCss && combinedCss.trim() !== "") editor.setStyle(combinedCss);
      console.log("✅ Loaded content into editor (components + css).");
    } catch (err) {
      console.error("Error setting editor content:", err);
    }
  }, [isReady, store, publishedProducts, navStore, navProducts]);

  
  // Save handler: saves both full HTML doc & CSS to backend
  const handleSave = async () => {
    const editor = editorInstanceRef.current;
    const currentStore = store || navStore;
    console.log("current store", currentStore);
    if (!editor) return alert("Editor not ready");
    if (!currentStore || !currentStore._id) return alert("Store data not ready");

    const bodyHtml = editor.getHtml(); // returns body markup
    const css = editor.getCss(); // returns css from style manager

    // Compose a full HTML document for serving on frontend/live preview
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${css || ""}</style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

    try {
      const res = await fetch(`http://localhost:8000/api/stores/stores/${currentStore._id}/website`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      body: JSON.stringify({
        websiteHtml: fullHtml,
        websiteCss: css || "",
        publishedProducts: currentStore.publishedProducts || [],
      })
    });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      alert("✅ Saved website successfully");

      // also update local store state with new html/css so re-entering editor shows latest
      // setStore((s) => ({ ...(s || {}), websiteHtml: fullHtml, websiteCss: css || "" }));
        setStore((prev) => ({ ...(prev || {}), ...data.store }));
          setStores(prev => prev.map(s => (s._id === data.store._id ? { ...data.store, localUrl: undefined } : s)));

        localStorage.setItem(`store_${data.store._id}`, JSON.stringify(data.store));

      return data.store
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to save website");
    }
  };

  // fallback simple generator — returns full HTML doc if no store.websiteHtml exists
  const generateWebsiteContent = (storeObj, products = []) => {
    console.log("publish product hai re", publishedProducts)
    console.log("pro", products);
    const name = (storeObj && storeObj.name) || "My Store";
    const category = (storeObj && storeObj.category) || "";
    const description = (storeObj && storeObj.description) || `Your trusted ${category} store with amazing products!`;
    // Keep this full HTML document minimal — CSS goes into editor.setStyle or saved CSS.
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .hero-gradient { background: linear-gradient(180deg,#4f46e5 0%,#3b82f6 100%); min-height:60vh; }
    .product-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
  </style>
</head>
<body>
  <header class="bg-transparent absolute top-0 left-0 w-full z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div><h1 class="text-2xl font-bold text-white">${name}</h1></div>
        <nav class="flex space-x-6 text-white font-semibold">
          <a href="#products" class="hover:text-gray-200">Products</a>
          <a href="#about" class="hover:text-gray-200">About</a>
          <button id="loginBtn" class="hover:text-gray-200">Login</button>
          <button id="registerBtn" class="hover:text-gray-200">Register</button>
        </nav>
      </div>
    </div>
  </header>

  <section class="hero-gradient text-white py-28 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-4xl font-bold mb-4">Welcome to ${name}</h2>
      <p class="text-xl mb-8">${description}</p>
      <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">Shop Now</a>
    </div>
  </section>

  <section id="products" class="py-16">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Our Products</h2>
      ${publishedProducts && publishedProducts.length
        ? `<div class="grid grid-cols-1 md:grid-cols-3 gap-8">${publishedProducts.map(p => `<div class="product-card p-4 bg-white rounded shadow"><img src="${p.image}" class="w-full h-48 object-cover"/><h3 class="mt-2">${p.name}</h3><p class="text-gray-600">$${Number(p.sellingPrice||p.price||0).toFixed(2)}</p></div>`).join("")}</div>`
        : `<div class="text-center text-gray-600">No products yet</div>`
      }
    </div>
  </section>

  <!-- Login/Register Modal -->
  <div id="authModal" class="hidden fixed inset-0 modal-bg flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 id="modalTitle" class="text-2xl font-bold mb-4 text-center"></h2>
      <form id="authForm" class="space-y-4">
        <input type="text" id="username" placeholder="Username" class="w-full border p-2 rounded" required />
        <input type="password" id="password" placeholder="Password" class="w-full border p-2 rounded" required />
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-semibold"></button>
      </form>
      <button id="closeModal" class="mt-4 text-gray-500 hover:text-gray-800 w-full text-center">Close</button>
    </div>
  </div>


  <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4">${store.name}</h3>
                    <p class="text-gray-400">Your trusted online ${store.name   } store.</p>
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

    <script>
    const modal = document.getElementById("authModal");
    const modalTitle = document.getElementById("modalTitle");
    const authForm = document.getElementById("authForm");
    const submitBtn = authForm.querySelector("button");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const closeModal = document.getElementById("closeModal");

    let currentMode = "login";

    const API_BASE = "http://localhost:8000/api/user"; // 🔁 Replace with your backend domain

    function openModal(mode) {
      currentMode = mode;
      modalTitle.textContent = mode === "login" ? "Login" : "Register";
      submitBtn.textContent = mode === "login" ? "Login" : "Register";
      modal.classList.remove("hidden");
    }

    function closeModalFn() {
      modal.classList.add("hidden");
    }

    loginBtn.addEventListener("click", () => openModal("login"));
    registerBtn.addEventListener("click", () => openModal("register"));
    closeModal.addEventListener("click", closeModalFn);

    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      try {
        const res = await fetch(\`\${API_BASE}/\${currentMode}\`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("storeUser", JSON.stringify(data.user));
          alert(\`\${currentMode} successful! Welcome, \${data.user.username}\`);
          closeModalFn();
        } else {
          alert(data.message || "Something went wrong");
        }
      } catch (err) {
        alert("Network error: " + err.message);
      }
    });
  </script>

</body>
</html>`;
  };


  

  return (
    <div className="min-h-screen">
      <div className="flex justify-end p-2 border-b bg-gray-50">
        <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
          💾 Save Website
        </button>
      </div>
      <div id="gjs" ref={editorContainerRef} style={{ minHeight: "80vh" }} />
    </div>
  );
};

export default WebEditor;
