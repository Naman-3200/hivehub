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
//       .get("http://localhost:8000/api/stores", {
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
//       "http://localhost:8000/api/store-analyzer/analyze",
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







import React, { useState, useEffect } from "react";
import axios from "axios";

const StoreAnalyzer = () => {
  const token = localStorage.getItem("token");

  const [storeUrl, setStoreUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");


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
        "http://localhost:8000/api/store-analyzer/analyze",
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
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">🔍 Store Analyzer</h1>

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

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Metric title="Revenue" value={`₹${analysis.totalRevenue}`} />
          <Metric title="Orders" value={analysis.totalOrders} />
          <Metric title="Products" value={analysis.totalProducts} />
          <Metric title="Visitors" value="N/A" />
        </div>
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
