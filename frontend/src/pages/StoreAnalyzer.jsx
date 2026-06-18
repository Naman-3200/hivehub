// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const StoreAnalyzer = () => {
//   const token = localStorage.getItem("token");

//   const [stores, setStores] = useState([]);
//   const [selectedStoreId, setSelectedStoreId] = useState("");
//   const [storeUrl, setStoreUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [analysis, setAnalysis] = useState(null);


//   useEffect(() => {
//     axios
//       .get("https://hivehub-1.onrender.com/api/stores", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setStores(res.data.stores || res.data))
//       .catch(() => setStores([]));
//   }, []);

//   const analyzeStore = async () => {
//     if (!storeUrl || !selectedStoreId) {
//     alert("Please select a store and enter Shopify URL");
//     return;
//   }

//     try {
//     setLoading(true);
//     setError("");
//     setAnalysis(null);

//     const res = await axios.post(
//       "https://hivehub-1.onrender.com/api/store-analyzer/analyze",
//       {
//         storeUrl,
//         hiveStoreId: selectedStoreId,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     setAnalysis(res.data);
//     } catch (err) {
//   console.error(err);

//   if (err.response?.status === 403 && err.response?.data?.requiresInstall) {
//     const installUrl = err.response.data.installUrl;
//     window.location.href = installUrl;
//     return;
//   }

//   setError("Failed to analyze store");
// }
//  finally {
//       setLoading(false);
//     }
//   };




//   return (
//     <div className="max-w-5xl mx-auto py-10">
//       <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
//         🔍 Store Analyzer
//       </h1>



//       <div className="bg-white p-6 rounded-xl shadow border space-y-4">
//             <select
//         value={selectedStoreId}
//         onChange={(e) => setSelectedStoreId(e.target.value)}
//         className="w-full border p-3 rounded-lg mb-3"
//       >
//         <option value="">Select HiveHub Store</option>
//         {stores.map((s) => (
//           <option key={s._id} value={s._id}>
//             {s.name}
//           </option>
//         ))}
//       </select>
//         <input
//           type="text"
//           placeholder="https://ccquww-hu.myshopify.com"
//           value={storeUrl}
//           onChange={(e) => setStoreUrl(e.target.value)}
//           className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
//         />

//         <button
//           onClick={analyzeStore}
//           disabled={loading}
//           className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
//         >
//           {loading ? "Analyzing..." : "Analyze Store"}
//         </button>

//         {error && (
//           <p className="text-red-600 font-medium">{error}</p>
//         )}
//       </div>

//       {/* {analysis && (
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Metric title="Total Products" value={analysis.totalProducts} />
//           <Metric title="Estimated Revenue" value={`₹${analysis.revenue}`} />
//           <Metric title="Estimated Visitors" value={analysis.visitors} />
//         </div>
//       )} */}

//       {analysis?.metrics && (
//   <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//     <Metric
//       title="Total Products"
//       value={analysis.metrics.totalProducts}
//     />
//     <Metric
//       title="Total Revenue"
//       value={`₹${analysis.metrics.totalRevenue}`}
//     />
//     <Metric
//       title="Total Orders"
//       value={analysis.metrics.totalOrders}
//     />
//     <Metric title="Visitors" value="N/A (Shopify limitation)" />

//   </div>
// )}

//     </div>
//   );
// };

// const Metric = ({ title, value }) => (
//   <div className="bg-white p-6 rounded-xl shadow text-center">
//     <p className="text-gray-500 text-sm">{title}</p>
//     <p className="text-2xl font-bold text-indigo-600 mt-2">{value}</p>
//   </div>
// );

// export default StoreAnalyzer;







// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const StoreAnalyzer = () => {
//   const token = localStorage.getItem("token");

//   const [storeUrl, setStoreUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [analysis, setAnalysis] = useState(null);
//   const [error, setError] = useState("");


//   useEffect(() => {
//   const params = new URLSearchParams(window.location.search);
//   if (params.get("installed") === "true") {
//     analyzeStore();
//   }
// }, []);


//   const analyzeStore = async () => {
//     if (!storeUrl) {
//       alert("Enter Shopify store URL");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setAnalysis(null);

//       const res = await axios.post(
//         "https://hivehub-1.onrender.com/api/store-analyzer/analyze",
//         { storeUrl },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setAnalysis(res.data.metrics);

//     } catch (err) {
//       if (err.response?.status === 403 && err.response?.data?.requiresInstall) {
//         window.location.href = err.response.data.installUrl;
//         return;
//       }
//       setError("Failed to analyze store");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-6">🔍 Store Analyzer</h1>

//       <div className="bg-white p-6 rounded-xl shadow space-y-4">
//         <input
//           type="text"
//           placeholder="https://ccquww-hu.myshopify.com"
//           value={storeUrl}
//           onChange={(e) => setStoreUrl(e.target.value)}
//           className="w-full border p-3 rounded-lg"
//         />

//         <button
//           onClick={analyzeStore}
//           disabled={loading}
//           className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
//         >
//           {loading ? "Analyzing..." : "Analyze Store"}
//         </button>

//         {error && <p className="text-red-600">{error}</p>}
//       </div>

//       {analysis && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
//           <Metric title="Revenue" value={`₹${analysis.totalRevenue}`} />
//           <Metric title="Orders" value={analysis.totalOrders} />
//           <Metric title="Products" value={analysis.totalProducts} />
//           <Metric title="Visitors" value="N/A" />
//         </div>
//       )}
//     </div>
//   );
// };

// const Metric = ({ title, value }) => (
//   <div className="bg-white p-6 rounded-xl shadow text-center">
//     <p className="text-gray-500">{title}</p>
//     <p className="text-2xl font-bold text-indigo-600">{value}</p>
//   </div>
// );

// export default StoreAnalyzer;








import React, { useState, useEffect } from "react";
import axios from "axios";

/* ---------------------------
   STATIC MOCK PRODUCT DATA
---------------------------- */
const STATIC_PRODUCTS = [
  {
    id: 1,
    name: "AS Games Mini Projector Disney Frozen",
    image:
      "https://cdn.shopify.com/s/files/1/0533/2089/files/projector.png",
    domain: "www.papell.gr",
    imagesCount: 8,
    variantsCount: 1,
    price: "$4.62",
    subPrice: "3.99 EUR",
    storeProducts: "11,550 Products",
    category: "Hobby",
    createdAt: "Mar 22, 2024",
  },
  {
    id: 2,
    name: "Benying P10 Rechargeable Mini Projector",
    image:
      "https://cdn.shopify.com/s/files/1/0533/2089/files/projector.png",
    domain: "ecdadeals.com",
    imagesCount: 7,
    variantsCount: 4,
    price: "$996.04",
    storeProducts: "47 Products",
    category: "Electronics",
    createdAt: "May 30, 2024",
  },
  {
    id: 3,
    name: "Mini projector with tripod",
    image:
      "https://cdn.shopify.com/s/files/1/0533/2089/files/projector.png",
    domain: "translucentech.myshopify.com",
    imagesCount: 5,
    variantsCount: 3,
    price: "$64.99",
    storeProducts: "4 Products",
    category: "Electronics & Accessories",
    createdAt: "Apr 24, 2022",
  },
];

const StoreAnalyzer = () => {
  const token = localStorage.getItem("token");

  const [storeUrl, setStoreUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

const handleImportToShopify = (product) => {
  console.log("Importing product to Shopify:", product);
  alert(`Import "${product.name}" to Shopify (API hookup pending)`);
  setOpenMenuId(null);
};


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("installed") === "true") {
      analyzeStore();
    }
  }, []);

  const analyzeStore = async () => {
    if (!storeUrl) {
      alert("Enter Shopify store URL");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const res = await axios.post(
        "https://hivehub-1.onrender.com/api/store-analyzer/analyze",
        { storeUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAnalysis(res.data.metrics);
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.requiresInstall) {
        window.location.href = err.response.data.installUrl;
        return;
      }
      setError("Failed to analyze store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">🔍 Store Analyzer</h1>

      {/* Input */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <input
          type="text"
          placeholder="https://ccquww-hu.myshopify.com"
          value={storeUrl}
          onChange={(e) => setStoreUrl(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <button
          onClick={analyzeStore}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Analyzing..." : "Analyze Store"}
        </button>

        {error && <p className="text-red-600">{error}</p>}
      </div>

      {/* METRICS */}
      {analysis && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Metric title="Revenue" value={`₹${analysis.totalRevenue}`} />
            <Metric title="Orders" value={analysis.totalOrders} />
            <Metric title="Products" value={analysis.totalProducts} />
            <Metric title="Visitors" value="N/A" />
          </div>

          {/* PRODUCT TABLE */}
          <div className="mt-10 bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Links</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Store Info</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Product Creation</th>
                  <th className="p-4 text-right">Actions</th> 

                </tr>
              </thead>

              <tbody>
                {STATIC_PRODUCTS.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 flex items-center gap-3">
                      {/* <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded border"
                      /> */}
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-blue-600 text-xs">{p.domain}</p>
                      </div>
                    </td>

                    <td className="p-4 text-gray-600">
                      {p.imagesCount} Images · {p.variantsCount} Variant
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-blue-600">
                        {p.price}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.subPrice}
                      </p>
                    </td>

                    <td className="p-4">{p.storeProducts}</td>

                    <td className="p-4">{p.category}</td>

                    <td className="p-4 text-gray-600">
                      {p.createdAt}
                    </td>

                    {/* ACTION MENU */}
      <td className="p-4 text-right relative">
        <button
          onClick={() =>
            setOpenMenuId(openMenuId === p.id ? null : p.id)
          }
          className="px-2 py-1 rounded hover:bg-gray-200"
        >
          ⋮
        </button>

        {openMenuId === p.id && (
          <div className="absolute right-4 top-10 z-50 bg-white border rounded-lg shadow-lg w-40">
            <button
              onClick={() => handleImportToShopify(p)}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600"
            >
              Import to Shopify
            </button>
          </div>
        )}
      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const Metric = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow text-center">
    <p className="text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-indigo-600">{value}</p>
  </div>
);

export default StoreAnalyzer;
