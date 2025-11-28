// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const SuperAdminUsers = () => {
//   const token = localStorage.getItem("token");
//   const [users, setUsers] = useState([]);
//   const [stores, setStores] = useState([]);

//   const load = async () => {
//     const [u, s] = await Promise.all([
//       axios.get("http://localhost:8000/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
//       axios.get("http://localhost:8000/api/admin/stores", { headers: { Authorization: `Bearer ${token}` } }),
//     ]);
//     setUsers(u.data || []);
//     setStores(s.data || []);
//   };

//   const toggleUser = async (userId, disabledd) => {
//     console.log("User data:", userId);
//     await axios.patch(`http://localhost:8000/api/admin/users/${userId}/disabled`, { disabledd }, { headers: { Authorization: `Bearer ${token}` } });
//     load();
//   };
//   const toggleStore = async (storeId, disabledd) => {
//     console.log("Stores data:", storeId);
//     await axios.patch(`http://localhost:8000/api/stores/${storeId}/toggle-status`, { disabledd }, { headers: { Authorization: `Bearer ${token}` } });
//     load();
//   };

//   useEffect(() => { load(); }, []);

//   return (
//     <div className="p-6 space-y-10">
//       <div>
//         <h1 className="text-xl font-semibold mb-3">Users</h1>
//         <div className="bg-white rounded shadow overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="text-left p-2">Name</th>
//                 <th className="text-left p-2">Email</th>
//                 <th className="text-left p-2">Role</th>
//                 <th className="text-left p-2">disabledd</th>
//                 <th className="text-left p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map(u => (
//                 <tr key={u._id} className="border-t">
//                   <td className="p-2">{u.name}</td>
//                   <td className="p-2">{u.email}</td>
//                   <td className="p-2">{u.role}</td>
//                   <td className="p-2">{u.disabledd ? "Yes" : "No"}</td>
//                   <td className="p-2">
//                     <button onClick={()=>toggleUser(u._id, !u.disabledd)} className="px-3 py-1 border rounded">
//                       {u.disabledd ? "Enable" : "disabled"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {users.length === 0 && <tr><td className="p-4 text-center text-gray-500" colSpan={5}>No users</td></tr>}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div>
//         <h1 className="text-xl font-semibold mb-3">Stores</h1>
//         <div className="bg-white rounded shadow overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="text-left p-2">Name</th>
//                 <th className="text-left p-2">Domain</th>
//                 <th className="text-left p-2">Orders</th>
//                 <th className="text-left p-2">Revenue</th>
//                 <th className="text-left p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stores.map(s => (
//                 <tr key={s._id} className="border-t">
//                   <td className="p-2">{s.name}</td>
//                   <td className="p-2">{s.customDomain || s.domain}</td>
//                   <td className="p-2">{s.totalOrders || 0}</td>
//                   <td className="p-2">₹{(s.totalRevenue || 0).toFixed(2)}</td>
//                   <td className="p-2">
//                     <button onClick={()=>toggleStore(s._id, !s.disabledd)} className="px-3 py-1 border rounded">
//                       {s.disabledd ? "Enable" : "disabled"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {stores.length === 0 && <tr><td className="p-4 text-center text-gray-500" colSpan={5}>No stores</td></tr>}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminUsers;












import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToggleLeft, ToggleRight, RefreshCcw } from "lucide-react";

export default function SuperAdminUsers() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, storeRes] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8000/api/admin/stores", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(userRes.data);
      setStores(storeRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to load users/stores");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, disabled) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/admin/users/${userId}/disable`,
        { disabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error("Error toggling user:", err);
      alert("Failed to update user status");
    }
  };

  const toggleStoreStatus = async (storeId, disabled) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/admin/stores/${storeId}/disable`,
        { disabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error("Error toggling store:", err);
      alert("Failed to update store status");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStores = stores.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🧠 SuperAdmin Management</h1>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search users or stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-60"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="all">All</option>
          <option value="users">Users</option>
          <option value="stores">Stores</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-600 mt-20">Loading...</div>
      ) : (
        <>
          {/* USERS TABLE */}
          {(filter === "all" || filter === "users") && (
            <section className="mb-10 bg-white shadow rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">👤 Users</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="border-t hover:bg-gray-50 transition">
                        <td className="py-2 px-4">{u.name}</td>
                        <td className="py-2 px-4">{u.email}</td>
                        <td className="py-2 px-4 capitalize">{u.role}</td>
                        <td className="py-2 px-4">
                          {u.disabled ? (
                            <span className="text-red-500 font-medium">Disabled</span>
                          ) : (
                            <span className="text-green-600 font-medium">Active</span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => toggleUserStatus(u._id, !u.disabled)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-md ${
                              u.disabled
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {u.disabled ? (
                              <>
                                <ToggleRight size={16} /> Enable
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={16} /> Disable
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No users found.</p>
                )}
              </div>
            </section>
          )}

          {/* STORES TABLE */}
          {(filter === "all" || filter === "stores") && (
            <section className="bg-white shadow rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">🏬 Stores</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4">Store Name</th>
                      <th className="text-left py-3 px-4">Domain</th>
                      <th className="text-left py-3 px-4">Owner</th>
                      <th className="text-left py-3 px-4">Revenue</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStores.map((s) => (
                      <tr key={s._id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-4">{s.name}</td>
                        <td className="py-2 px-4">{s.domain}</td>
                        <td className="py-2 px-4">{s.ownerId?.email || "N/A"}</td>
                        <td className="py-2 px-4">₹{s.totalRevenue || 0}</td>
                        <td className="py-2 px-4">
                          {s.disabled ? (
                            <span className="text-red-500 font-medium">Disabled</span>
                          ) : (
                            <span className="text-green-600 font-medium">Active</span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => toggleStoreStatus(s._id, !s.disabled)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-md ${
                              s.disabled
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {s.disabled ? (
                              <>
                                <ToggleRight size={16} /> Enable
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={16} /> Disable
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredStores.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No stores found.</p>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
