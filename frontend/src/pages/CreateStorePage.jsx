// import React, { useState } from "react";
// import DEFAULT_CATEGORIES from "../pages/storeCategories.jsx";

// const CreateStorePage = ({
//   newStore,
//   setNewStore,
//   storeCategories,
//   setCurrentView,
// }) => {
//   const token = localStorage.getItem("token");

//   const [showShopifyConnect, setShowShopifyConnect] = useState(false);
//   const [createdStoreId, setCreatedStoreId] = useState(null);
//   const [shopifyDomain, setShopifyDomain] = useState("");

//   const categories =
//     Array.isArray(storeCategories) && storeCategories.length > 0
//       ? storeCategories
//       : DEFAULT_CATEGORIES;

//   // -------------------------------
//   // CREATE STORE FUNCTION
//   // -------------------------------
//   const handleCreateStore = async () => {
//     try {
//       if (!newStore?.name || !newStore?.category) {
//         alert("Please enter store name & select a category");
//         return;
//       }

//       const domainSlug = newStore.name
//         .toLowerCase()
//         .replace(/\s+/g, "-")
//         .replace(/[^a-z0-9-]/g, "");

//       const uniqueId = Date.now();

//       const payload = {
//         name: newStore.name,
//         category: newStore.category,
//         description: newStore.description || "",
//         domain: `${domainSlug}-${uniqueId}.hivehub.store`,
//         url: `http://localhost:5173/store/${domainSlug}-${uniqueId}`,
//       };

//       console.log("Sending store payload:", payload);

//       const res = await fetch("http://localhost:8000/api/stores", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Failed to create store");
//         return;
//       }

//       // SHOW SHOPIFY POPUP
//       setCreatedStoreId(data.store._id);
//       setShowShopifyConnect(true);

//       // Reset
//       setNewStore({ name: "", category: "", description: "" });

//     } catch (error) {
//       console.error("Store creation failed:", error);
//       alert("Something went wrong while creating the store.");
//     }
//   };

//   // -------------------------------
//   // CONNECT SHOPIFY
//   // -------------------------------
//   const connectShopify = async () => {
//     try {
//       if (!shopifyDomain) {
//         alert("Enter your Shopify domain first");
//         return;
//       }

//       const res = await fetch(
//         `http://localhost:8000/auth/shopify/install?shop=${shopifyDomain}&hiveStoreId=${createdStoreId}`
//       );

//       const data = await res.json();
//       window.location.href = data.installUrl; // Redirect to Shopify
//     } catch (error) {
//       console.error("Shopify connect failed:", error);
//       alert("Failed to connect Shopify.");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto py-10">

//       <div className="mb-10 text-center">
//         <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
//           Create a New Store
//         </h1>
//         <p className="text-slate-600 text-lg">Set up your online store</p>
//       </div>

//       <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
//         <div className="space-y-8">

//           <div>
//             <label className="block text-sm font-medium mb-2">Store Name</label>
//             <input
//               type="text"
//               value={newStore?.name}
//               onChange={(e) =>
//                 setNewStore({ ...newStore, name: e.target.value })
//               }
//               placeholder="Enter store name"
//               className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-3">
//               Select Category
//             </label>

//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {categories.map((cat) => (
//                 <button
//                   key={cat.id}
//                   type="button"
//                   onClick={() =>
//                     setNewStore({ ...newStore, category: cat.id })
//                   }
//                   className={`p-6 border rounded-xl transition-all ${
//                     newStore?.category === cat.id
//                       ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md"
//                       : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
//                   }`}
//                 >
//                   <div className="text-3xl">{cat.icon}</div>
//                   <div className="text-sm mt-2 font-medium">{cat.name}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-between pt-2">
//             <button
//               onClick={() => setCurrentView("stores")}
//               className="px-6 py-2 border rounded-lg hover:bg-gray-100"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleCreateStore}
//               disabled={!newStore?.name || !newStore?.category}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
//             >
//               Generate Website
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* ============================ */}
//       {/* SHOPIFY CONNECT MODAL        */}
//       {/* ============================ */}
//       {showShopifyConnect && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl">
//             <h2 className="text-2xl font-bold mb-4">Connect Shopify Store</h2>
//             <p className="mb-3 text-gray-600">
//               Enter your Shopify store domain to provision your store automatically.
//             </p>

//             <input
//               type="text"
//               placeholder="mystore.myshopify.com"
//               className="w-full border p-3 rounded-lg mb-4"
//               onChange={(e) => setShopifyDomain(e.target.value)}
//               value={shopifyDomain}
//             />

//             <button
//                 onClick={() => window.location.href = "https://accounts.shopify.com/store-login"}
//                 className="btn-primary"
//               >
//                 Login to Shopify
//               </button>

//               <button
//                 onClick={() => window.location.href = "https://www.shopify.com/signup"}
//                 className="btn-secondary"
//               >
//                 Create Shopify Store
//               </button>


//             <button
//               className="bg-black text-white px-6 py-3 rounded-lg w-full"
//               onClick={connectShopify}
//             >
//               Connect Shopify
//             </button>

//             <button
//               className="mt-4 text-gray-500 underline w-full"
//               onClick={() => setShowShopifyConnect(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default CreateStorePage;










import React, { useState } from "react";
import DEFAULT_CATEGORIES from "../pages/storeCategories.jsx";

const CreateStorePage = ({
  newStore,
  setNewStore,
  storeCategories,
  setCurrentView,
}) => {
  const token = localStorage.getItem("token");

  const [showShopifyConnect, setShowShopifyConnect] = useState(false);
  const [createdStoreId, setCreatedStoreId] = useState(null);
  const [shopifyDomain, setShopifyDomain] = useState("");

  const categories =
    Array.isArray(storeCategories) && storeCategories.length > 0
      ? storeCategories
      : DEFAULT_CATEGORIES;

  // ----------------------------------------------------------------
  // CREATE STORE IN HIVEHUB — Step 1
  // ----------------------------------------------------------------
  const handleCreateStore = async () => {
    try {
      if (!newStore?.name || !newStore?.category) {
        alert("Please enter store name & select a category");
        return;
      }

      const domainSlug = newStore.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const uniqueId = Date.now();

      const payload = {
        name: newStore.name,
        category: newStore.category,
        description: newStore.description || "",
        domain: `${domainSlug}-${uniqueId}.hivehub.store`,
        url: `http://localhost:5173/store/${domainSlug}-${uniqueId}`,
      };

      const res = await fetch("http://localhost:8000/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create store");
        return;
      }

      setCreatedStoreId(data.store._id);
      setShowShopifyConnect(true);
      setNewStore({ name: "", category: "", description: "" });

    } catch (error) {
      console.error("Store creation failed:", error);
      alert("Something went wrong while creating the store.");
    }
  };

  // ----------------------------------------------------------------
  // STEP 2 — CONNECT SHOPIFY
  // ----------------------------------------------------------------
  const connectShopify = async () => {
    try {
      if (!shopifyDomain) {
        alert("Enter your Shopify domain first");
        return;
      }

      const res = await fetch(
        `http://localhost:8000/auth/shopify/install?shop=${shopifyDomain}&hiveStoreId=${createdStoreId}`
      );

      const data = await res.json();
      window.location.href = data.installUrl;

    } catch (error) {
      console.error("Shopify connect failed:", error);
      alert("Failed to connect Shopify.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Create a New Store
        </h1>
        <p className="text-slate-600 text-lg">Set up your online store</p>
      </div>

      {/* Form */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <div className="space-y-8">

          <div>
            <label className="block text-sm font-medium mb-2">Store Name</label>
            <input
              type="text"
              value={newStore?.name}
              onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              placeholder="Enter store name"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Select Category</label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setNewStore({ ...newStore, category: cat.id })}
                  className={`p-6 border rounded-xl transition-all ${
                    newStore?.category === cat.id
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md"
                      : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                  }`}
                >
                  <div className="text-3xl">{cat.icon}</div>
                  <div className="text-sm mt-2 font-medium">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={() => setCurrentView("stores")} className="px-6 py-2 border rounded-lg hover:bg-gray-100">
              Cancel
            </button>

            <button
              onClick={handleCreateStore}
              disabled={!newStore?.name || !newStore?.category}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
            >
              Generate Website
            </button>
          </div>

        </div>
      </div>

      {/* ======================== SHOPIFY MODAL ======================== */}
      {showShopifyConnect && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Connect Shopify Store</h2>

            <p className="mb-5 text-gray-600">
              Login or register into Shopify to continue store creation.
            </p>

            {/* Login/Register buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => window.open("https://accounts.shopify.com/store-login", "_blank")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
              >
                Login to Shopify
              </button>

              <button
                onClick={() => window.open("https://www.shopify.com/signup", "_blank")}
                className="px-6 py-3 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                Create Shopify Store
              </button>
            </div>

            <p className="text-gray-500 mb-2">After login, enter your Shopify store domain:</p>

            <input
              type="text"
              placeholder="mystore.myshopify.com"
              className="w-full border p-3 rounded-lg mb-4"
              onChange={(e) => setShopifyDomain(e.target.value)}
              value={shopifyDomain}
            />

            <button
              className="bg-black text-white px-6 py-3 rounded-lg w-full hover:bg-gray-900 disabled:opacity-40"
              disabled={!shopifyDomain}
              onClick={connectShopify}
            >
              Connect Shopify
            </button>

            <button
              className="mt-4 text-gray-500 underline w-full"
              onClick={() => setShowShopifyConnect(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStorePage;
