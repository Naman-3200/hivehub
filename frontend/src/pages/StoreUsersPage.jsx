import React, { useEffect, useState } from "react";
import axios from "axios";

const StoreUsersPage = ({ storeId }) => {
  const token = localStorage.getItem("token");
  const [range, setRange] = useState("month");
  const [rows, setRows] = useState([]);
  const [timeseries, setTimeseries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get("https://hivehub-1.onrender.com/api/store-users/manage", {
      headers: { Authorization: `Bearer ${token}` },
      params: { storeId, range }
    });
    setRows(res.data.users || []);
    setTimeseries(res.data.timeseries || []);
  };

  const fetchProfile = async (storeUserId) => {
    const res = await axios.get(`https://hivehub-1.onrender.com/api/store-users/manage/${storeUserId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProfile(res.data.profile);
    setOrders(res.data.orders);
  };

  const block = async (id, blocked) => {
    await axios.patch(`https://hivehub-1.onrender.com/api/store-users/manage/${id}/block`, { blocked }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchUsers();
    if (selected?.id === id) fetchProfile(id);
  };

  const remove = async (id) => {
    if (!confirm("Delete this user?")) return;
    await axios.delete(`https://hivehub-1.onrender.com/api/store-users/manage/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSelected(null);
    setProfile(null);
    setOrders([]);
    fetchUsers();
  };

  useEffect(() => { if (storeId) fetchUsers(); }, [storeId, range]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Store Users</h1>
        <select value={range} onChange={(e)=>setRange(e.target.value)} className="border rounded px-3 py-2">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Joined</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{new Date(u.createdAt).toLocaleString()}</td>
                <td className="p-3">{u.blocked ? <span className="text-red-600">Blocked</span> : "Active"}</td>
                <td className="p-3 space-x-2">
                  <button onClick={()=>{ setSelected({id: u._id}); fetchProfile(u._id); }} className="px-3 py-1 border rounded">View</button>
                  <button onClick={()=>block(u._id, !u.blocked)} className="px-3 py-1 border rounded">{u.blocked ? "Unblock" : "Block"}</button>
                  <button onClick={()=>remove(u._id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="p-6 text-center text-gray-500" colSpan={5}>No users</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer / modal: profile + order history */}
      {profile && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-gray-500">Name:</span> {profile.name}</div>
            <div><span className="text-gray-500">Email:</span> {profile.email}</div>
            <div><span className="text-gray-500">Phone:</span> {profile.phone || "-"}</div>
            <div className="md:col-span-3"><span className="text-gray-500">Address:</span> {profile.address || "-"}</div>
          </div>

          <h3 className="font-semibold mt-6 mb-2">Order History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2">OrderId</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-t">
                    <td className="p-2">{o.orderId}</td>
                    <td className="p-2">₹{(o.totalPrice || 0).toFixed(2)}</td>
                    <td className="p-2">{o.status}</td>
                    <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td className="p-4 text-center text-gray-500" colSpan={4}>No orders</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreUsersPage;
