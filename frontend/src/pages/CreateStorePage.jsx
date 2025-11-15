// import React from "react";

// const CreateStorePage = ({
//   newStore,
//   setNewStore,
//   storeCategories,
//   createStore,
//   navigate
// }) => {
//   return (
//     <div className="max-w-3xl sm:max-w-4xl mx-auto py-10">
//       {/* Header */}
//       <div className="mb-10 sm:mb-12 text-center">
//         <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
//           Create a New Store
//         </h1>
//         <p className="text-slate-600 text-base sm:text-lg">
//           Set up your online store in just a few elegant steps
//         </p>
//       </div>

//       {/* Create Store Card */}
//       <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200">
//         <div className="space-y-8 sm:space-y-10">
          
//           {/* Store Name */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Store Name
//             </label>
//             <input
//               type="text"
//               value={newStore?.name || ""}
//               onChange={(e) =>
//                 setNewStore({ ...newStore, name: e.target.value })
//               }
//               placeholder="Enter your store name"
//               className="w-full px-4 py-3 border border-slate-300 rounded-lg 
//                          focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Categories */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-3">
//               What do you want to sell?
//             </label>

//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
//               {(storeCategories || []).map((category) => (
//                 <button
//                   type="button"
//                   key={category.id}
//                   onClick={() =>
//                     setNewStore({ ...newStore, category: category.id })
//                   }
//                   className={`p-5 sm:p-6 rounded-xl text-center border transition-all transform 
//                     hover:scale-[1.02] ${
//                       newStore?.category === category.id
//                         ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md"
//                         : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
//                     }`}
//                 >
//                   <div className="text-2xl sm:text-3xl mb-2">{category.icon}</div>
//                   <div className="text-sm font-medium">{category.name}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-2">
//             <button
//               type="button"
//               onClick={() => navigate("/stores")}
//               className="px-6 py-2 border border-slate-300 rounded-lg 
//                          text-slate-700 hover:bg-slate-50 transition"
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               onClick={createStore}
//               disabled={!newStore?.name || !newStore?.category}
//               className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 
//                          text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.01]
//                          disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//             >
//               Generate Website
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateStorePage;







// // src/pages/CreateStorePage.jsx
// import React, { useState, useEffect } from "react";
// import DEFAULT_CATEGORIES from "../pages/storeCategories.jsx"; // adjust path

// const CreateStorePage = ({
//   newStore: newStoreProp,
//   setNewStore: setNewStoreProp,
//   storeCategories: storeCategoriesProp,
//   createStore: createStoreProp,
//   setCurrentView,
//   navigate,
// }) => {
//   // fallback local state if parent didn't provide setter
//   const [localNewStore, setLocalNewStore] = useState({
//     name: "",
//     category: "",
//     description: "",
//   });

//   // final categories used (prop > default)
//   const categories = (Array.isArray(storeCategoriesProp) && storeCategoriesProp.length > 0)
//     ? storeCategoriesProp
//     : DEFAULT_CATEGORIES;

//   useEffect(() => {
//     console.log("CreateStorePage categories (prop vs default):", {
//       fromProp: storeCategoriesProp,
//       used: categories,
//     });
//   }, [storeCategoriesProp]); // eslint-disable-line

//   // controlled state fallback logic
//   useEffect(() => {
//     if (newStoreProp && !setNewStoreProp) {
//       setLocalNewStore((prev) => ({ ...prev, ...newStoreProp }));
//     }
//   }, [newStoreProp, setNewStoreProp]);

//   const newStore = newStoreProp ?? localNewStore;
//   const setNewStore = typeof setNewStoreProp === "function" ? setNewStoreProp : setLocalNewStore;

//   // createStore wrapper: prefer parent's createStore if present
//   const handleCreateStore = async () => {
//     if (typeof createStoreProp === "function") {
//       await createStoreProp();
//       return;
//     }
//     // fallback local behaviour (no backend)
//     const payload = { ...newStore, id: Date.now() };
//     alert("Store created locally (no backend). Name: " + (payload.name || "<empty>"));
//     if (!setNewStoreProp) setLocalNewStore({ name: "", category: "", description: "" });
//     if (typeof setCurrentView === "function") setCurrentView("stores");
//     else if (typeof navigate === "function") navigate("/stores");
//   };

//   const handleNameChange = (e) => setNewStore({ ...newStore, name: e.target.value });
//   const handleCategorySelect = (categoryId) => setNewStore({ ...newStore, category: categoryId });
//   const handleCancel = () => {
//     if (typeof setCurrentView === "function") setCurrentView("stores");
//     else if (typeof navigate === "function") navigate("/stores");
//   };

//   return (
//     <div className="max-w-3xl sm:max-w-4xl mx-auto py-10">
//       <div className="mb-10 sm:mb-12 text-center">
//         <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
//           Create a New Store
//         </h1>
//         <p className="text-slate-600 text-base sm:text-lg">
//           Set up your online store in just a few elegant steps
//         </p>
//       </div>

//       <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200">
//         <div className="space-y-8 sm:space-y-10">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">Store Name</label>
//             <input
//               type="text"
//               value={newStore?.name || ""}
//               onChange={handleNameChange}
//               placeholder="Enter your store name"
//               className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-3">What do you want to sell?</label>

//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
//               {categories.map((category) => (
//                 <button
//                   key={category.id}
//                   type="button"
//                   onClick={() => handleCategorySelect(category.id)}
//                   className={`p-5 sm:p-6 rounded-xl text-center border transition-all transform hover:scale-[1.02] ${
//                     newStore?.category === category.id
//                       ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md"
//                       : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
//                   }`}
//                 >
//                   <div className="text-2xl sm:text-3xl mb-2">{category.icon}</div>
//                   <div className="text-sm font-medium">{category.name}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-2">
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               onClick={handleCreateStore}
//               disabled={!newStore?.name || !newStore?.category}
//               className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//             >
//               Generate Website
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateStorePage;












import React from "react";
import DEFAULT_CATEGORIES from "../pages/storeCategories.jsx";

const CreateStorePage = ({
  newStore,
  setNewStore,
  storeCategories,
  setCurrentView,
}) => {
  const token = localStorage.getItem("token");

  // FINAL categories array
  const categories =
    Array.isArray(storeCategories) && storeCategories.length > 0
      ? storeCategories
      : DEFAULT_CATEGORIES;

  // BACKEND STORE CREATE CALL
  const handleCreateStore = async () => {
    try {
      if (!newStore?.name || !newStore?.category) {
        alert("Please enter store name & select a category");
        return;
      }

      // generate domain
      const domainSlug = newStore.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const finalDomain = `${domainSlug}-${Date.now()}.hivehub.store`;

      const payload = {
        name: newStore.name,
        category: newStore.category,
        description: newStore.description || "",
        domain: finalDomain,
        url: `https://hivehub-tr8u.vercel.app/store/${domainSlug}-${Date.now()}`,
      };

      const res = await fetch("https://hivehub-1.onrender.com/api/stores", {
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

      alert("Store created successfully!");

      // reset store
      setNewStore({ name: "", category: "", description: "" });

      // back to list
      setCurrentView("stores");

    } catch (error) {
      console.error("Store creation failed:", error);
      alert("Something went wrong while creating the store.");
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

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <div className="space-y-8">

          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Store Name</label>
            <input
              type="text"
              value={newStore?.name}
              onChange={(e) =>
                setNewStore({ ...newStore, name: e.target.value })
              }
              placeholder="Enter store name"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium mb-3">Select Category</label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setNewStore({ ...newStore, category: cat.id })
                  }
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

          {/* Buttons */}
          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentView("stores")}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100"
            >
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

    </div>
  );
};

export default CreateStorePage;
