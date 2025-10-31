import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    start: "",
    end: "",
    storeId: "",
  });
  const [metrics, setMetrics] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [topStores, setTopStores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStores();
    fetchKPIs(); // Initial load
  }, []);

  // ✅ Fetch store list
  const fetchStores = async () => {
    try {
      const res = await axios.get("https://hivehub-1.onrender.com/api/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      if (Array.isArray(data)) setStores(data);
      else if (Array.isArray(data.stores)) setStores(data.stores);
      else setStores([]);
    } catch (err) {
      console.error("Error fetching stores:", err);
      setStores([]);
    }
  };

  // ✅ Fetch KPI metrics
  const fetchKPIs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.start) params.start = filters.start;
      if (filters.end) params.end = filters.end;
      if (filters.storeId) params.storeId = filters.storeId;

      const res = await axios.get("https://hivehub-1.onrender.com/api/dashboard/kpis", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const data = res.data || {};
      console.log("Fetched KPI data:", data);
      setMetrics(data.metrics || {});
      setTimeseries(data.timeseries || []);
      setTopStores(data.topStores || []);
    } catch (err) {
      console.error("Error fetching KPIs:", err);
      setMetrics(null);
      setTimeseries([]);
      setTopStores([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle input change for filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // ✅ Format numbers safely
  const formatCurrency = (val) =>
    `₹${Number(val || 0).toLocaleString("en-IN")}`;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Store Dashboard</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow mb-8">
//         <label className="text-gray-700">Store:</label>
//         <select
//           name="storeId"
//           value={filters.storeId}
//           onChange={handleFilterChange}
//           className="border rounded-md p-2"
//         >
//           <option value="">All Stores</option>
//           {stores.map((store) => (
//             <option key={store._id} value={store._id}>
//               {store.name}
//             </option>
//           ))}
//         </select>

//         <label className="text-gray-700">Start Date:</label>
//         <input
//           type="date"
//           name="start"
//           value={filters.start}
//           onChange={handleFilterChange}
//           className="border rounded-md p-2"
//         />

//         <label className="text-gray-700">End Date:</label>
//         <input
//           type="date"
//           name="end"
//           value={filters.end}
//           onChange={handleFilterChange}
//           className="border rounded-md p-2"
//         />

//         <button
//           onClick={fetchKPIs}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//           disabled={loading}
//         >
//           {loading ? "Loading..." : "Apply Filters"}
//         </button>
//       </div>

//       {/* KPI Metrics */}
//       {metrics ? (
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
//           <MetricCard title="Total Revenue" value={formatCurrency(metrics.totalRevenue)} />
//           <MetricCard title="Total Orders" value={metrics.totalOrders || 0} />
//           <MetricCard title="Avg Order Value" value={formatCurrency(metrics.avgOrderValue)} />
//           <MetricCard title="New Customers" value={metrics.newCustomers || 0} />
//           <MetricCard title="Repeat Customers" value={metrics.repeatCustomers || 0} />
//         </div>
//       ) : (
//         <div className="text-gray-500 mb-8">No KPI data available.</div>
//       )}

//       {/* Line Chart */}
//       <div className="bg-white p-6 rounded-lg shadow mb-8">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//           Orders & Revenue Over Time
//         </h2>
//         {timeseries.length > 0 ? (
//           <ResponsiveContainer width="100%" height={350}>
//             <LineChart data={timeseries}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis yAxisId="left" orientation="left" />
//               <YAxis yAxisId="right" orientation="right" />
//               <Tooltip formatter={(value, name) => (name === "Revenue (₹)" ? formatCurrency(value) : value)} />
//               <Legend />
//               <Line
//                 yAxisId="left"
//                 type="monotone"
//                 dataKey="orders"
//                 stroke="#8884d8"
//                 name="Orders"
//                 strokeWidth={2}
//                 dot={false}
//               />
//               <Line
//                 yAxisId="right"
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#82ca9d"
//                 name="Revenue (₹)"
//                 strokeWidth={2}
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         ) : (
//           <p className="text-gray-500 text-center py-10">
//             No data available for selected filters.
//           </p>
//         )}
//       </div>

//       {/* Top Stores */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//           🏬 Top 10 Stores by Revenue
//         </h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-200 text-sm">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="p-2 text-left">Store</th>
//                 <th className="p-2 text-left">Orders</th>
//                 <th className="p-2 text-left">Revenue (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {topStores.length > 0 ? (
//                 topStores.map((store) => (
//                   <tr key={store.storeId} className="border-t hover:bg-gray-50">
//                     <td className="p-2">{store.name || "Unknown Store"}</td>
//                     <td className="p-2">{store.orders}</td>
//                     <td className="p-2">{formatCurrency(store.revenue)}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="text-center p-4 text-gray-500">
//                     No stores data available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ✅ Reusable KPI card
// const MetricCard = ({ title, value }) => (
//   <div className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow">
//     <h2 className="text-gray-600 text-sm">{title}</h2>
//     <p className="text-2xl font-bold text-blue-600 mt-1">{value}</p>
//   </div>
// );






return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
    <div className="flex-1 p-8 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight flex items-center gap-2">
          📊{" "}
          <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            Store Dashboard
          </span>
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-white/80 backdrop-blur-sm border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow mb-10">
          <label className="text-gray-700 font-medium">Store:</label>
          <select
            name="storeId"
            value={filters.storeId}
            onChange={handleFilterChange}
            className="border-gray-300 rounded-xl p-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
          >
            <option value="">All Stores</option>
            {stores.map((store) => (
              <option key={store._id} value={store._id}>
                {store.name}
              </option>
            ))}
          </select>

          <label className="text-gray-700 font-medium">Start Date:</label>
          <input
            type="date"
            name="start"
            value={filters.start}
            onChange={handleFilterChange}
            className="border-gray-300 rounded-xl p-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
          />

          <label className="text-gray-700 font-medium">End Date:</label>
          <input
            type="date"
            name="end"
            value={filters.end}
            onChange={handleFilterChange}
            className="border-gray-300 rounded-xl p-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
          />

          <button
            onClick={fetchKPIs}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Loading..." : "Apply Filters"}
          </button>
        </div>

        {/* KPI Metrics */}
        {metrics ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
            <MetricCard title="Total Revenue" value={formatCurrency(metrics.totalRevenue)} />
            <MetricCard title="Total Orders" value={metrics.totalOrders || 0} />
            <MetricCard title="Avg Order Value" value={formatCurrency(metrics.avgOrderValue)} />
            <MetricCard title="New Customers" value={metrics.newCustomers || 0} />
            <MetricCard title="Repeat Customers" value={metrics.repeatCustomers || 0} />
          </div>
        ) : (
          <div className="text-gray-500 text-center italic mb-10">No KPI data available.</div>
        )}

        {/* Line Chart */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow mb-10 flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            📈 Orders & Revenue Over Time
          </h2>
          {timeseries.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timeseries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#555" />
                <YAxis yAxisId="left" orientation="left" stroke="#555" />
                <YAxis yAxisId="right" orientation="right" stroke="#555" />
                <Tooltip
                  contentStyle={{ borderRadius: "10px", border: "1px solid #ddd" }}
                  formatter={(value, name) =>
                    name === "Revenue ($)" ? formatCurrency(value) : value
                  }
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="orders"
                  stroke="#6366f1"
                  name="Orders"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  name="Revenue (₹)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12 italic">
              No data available for selected filters.
            </p>
          )}
        </div>

        {/* Top Stores */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            🏬 Top 10 Stores by Revenue
          </h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full border border-gray-200 text-sm overflow-hidden rounded-lg">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 uppercase tracking-wider">
                <tr>
                  <th className="p-3 text-left font-semibold">Store</th>
                  <th className="p-3 text-left font-semibold">Orders</th>
                  <th className="p-3 text-left font-semibold">Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {topStores.length > 0 ? (
                  topStores.map((store) => (
                    <tr
                      key={store.storeId}
                      className="border-t border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors"
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {store.name || "Unknown Store"}
                      </td>
                      <td className="p-3 text-gray-700">{store.orders}</td>
                      <td className="p-3 text-gray-800 font-semibold">
                        {formatCurrency(store.revenue)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center p-6 text-gray-500 italic">
                      No stores data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}

// ✅ Reusable KPI Card
const MetricCard = ({ title, value }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center flex flex-col justify-center">
    <h2 className="text-gray-500 text-sm font-medium">{title}</h2>
    <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
      {value}
    </p>
  </div>
);



export default Dashboard;








// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const Dashboard = () => {
//   const [metrics, setMetrics] = useState(null);
//   const [timeseries, setTimeseries] = useState([]);
//   const [topStores, setTopStores] = useState([]);
//   const [stores, setStores] = useState([]);
//   const [selectedStore, setSelectedStore] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Fetch store list
//   const fetchStores = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("https://hivehub-1.onrender.com/api/stores", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Fetched stores:", response.data);
//       setStores(response.data || []);
//     } catch (err) {
//       console.error("Error fetching stores:", err);
//       setError("Failed to load stores");
//     }
//   };

//   // Fetch KPIs
//   const fetchKPIs = async (storeId = "") => {
//     try {
//       const token = localStorage.getItem("token");
//       const url = storeId
//         ? `https://hivehub-1.onrender.com/api/dashboard/kpis?storeId=${storeId}`
//         : "https://hivehub-1.onrender.com/api/dashboard/kpis";

//       const response = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const { metrics, timeseries, topStores } = response.data;
//       setMetrics(metrics);
//       setTimeseries(timeseries);
//       setTopStores(topStores);
//     } catch (err) {
//       console.error("Error fetching KPIs:", err);
//       setError("Failed to load KPIs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStores();
//     fetchKPIs();
//   }, []);

//   const handleStoreChange = (e) => {
//     const value = e.target.value;
//     setSelectedStore(value);
//     fetchKPIs(value);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <p className="text-gray-600 text-lg">Loading dashboard...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-red-50">
//         <p className="text-red-600 text-lg">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800">📊 Business Dashboard</h1>
//         <select
//           value={selectedStore}
//           onChange={handleStoreChange}
//           className="px-4 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
//         >
//           <option value="">All Stores</option>
//           {Array.isArray(stores) &&
//             stores.map((store) => (
//               <option key={store._id} value={store._id}>
//                 {store.name}
//               </option>
//             ))}
//         </select>
//       </div>

//       {/* Summary Metrics */}
//       {metrics && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//           <div className="bg-white shadow rounded-xl p-4 text-center">
//             <p className="text-gray-500">Total Revenue</p>
//             <h3 className="text-2xl font-bold text-green-600">₹{metrics.totalRevenue.toFixed(2)}</h3>
//           </div>
//           <div className="bg-white shadow rounded-xl p-4 text-center">
//             <p className="text-gray-500">Total Orders</p>
//             <h3 className="text-2xl font-bold text-blue-600">{metrics.totalOrders}</h3>
//           </div>
//           <div className="bg-white shadow rounded-xl p-4 text-center">
//             <p className="text-gray-500">Avg Order Value</p>
//             <h3 className="text-2xl font-bold text-purple-600">₹{metrics.avgOrderValue.toFixed(2)}</h3>
//           </div>
//           <div className="bg-white shadow rounded-xl p-4 text-center">
//             <p className="text-gray-500">New Customers</p>
//             <h3 className="text-2xl font-bold text-indigo-600">{metrics.newCustomers}</h3>
//           </div>
//           <div className="bg-white shadow rounded-xl p-4 text-center">
//             <p className="text-gray-500">Repeat Customers</p>
//             <h3 className="text-2xl font-bold text-pink-600">{metrics.repeatCustomers}</h3>
//           </div>
//         </div>
//       )}

//       {/* Sales Trend Chart */}
//       <div className="bg-white shadow rounded-xl p-6 mb-8">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4">📈 Sales Trend</h2>
//         <ResponsiveContainer width="100%" height={350}>
//           <LineChart data={timeseries}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="revenue" stroke="#34d399" name="Revenue" />
//             <Line type="monotone" dataKey="orders" stroke="#60a5fa" name="Orders" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Top Stores */}
//       <div className="bg-white shadow rounded-xl p-6">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4">🏬 Top Stores by Revenue</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm text-gray-700">
//             <thead>
//               <tr className="border-b bg-gray-100">
//                 <th className="text-left py-3 px-4">Store Name</th>
//                 <th className="text-left py-3 px-4">Orders</th>
//                 <th className="text-left py-3 px-4">Revenue</th>
//               </tr>
//             </thead>
//             <tbody>
//               {topStores?.map((store, i) => (
//                 <tr key={i} className="border-b hover:bg-gray-50">
//                   <td className="py-2 px-4">{store.name || "Unnamed Store"}</td>
//                   <td className="py-2 px-4">{store.orders}</td>
//                   <td className="py-2 px-4 text-green-600 font-semibold">
//                     ₹{store.revenue.toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {topStores?.length === 0 && (
//             <p className="text-center text-gray-500 mt-4">No store data available</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
