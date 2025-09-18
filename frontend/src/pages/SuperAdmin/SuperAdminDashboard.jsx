import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import DashboardLayout from "../../components/DashboardLayout";
import UsersTable from "../../components/UserTable";
import AnalyticsDashboard from "../../components/AnalyticsDashboard";
import { Settings } from "lucide-react";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalSuperAdmins: 0,
    usersToday: 0,
  });
  const [users, setUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard stats
  const loadStats = useCallback(async () => {
    try {
      const response = await api.get("/user/stats");
      setStats(response.data.stats);
      setRecentUsers(response.data.recentUsers);
    } catch (error) {
      console.error("Failed to load stats:", error);
      if (error.response?.status === 403) {
        alert("Access denied. SuperAdmin privileges required.");
        navigate("/");
      }
    }
  }, [navigate]);

  // Load users list
  const loadUsers = async () => {
    try {
      const response = await api.get("/user", {
        params: { page: 1, limit: 100 },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const deleteUser = async (userId, userName) => {
    // Double confirmation for delete action
    const firstConfirm = confirm(
      `Are you sure you want to delete ${userName}?\n\nThis action cannot be undone.`
    );

    if (!firstConfirm) return;

    const secondConfirm = confirm(
      `⚠️ FINAL WARNING ⚠️\n\nYou are about to permanently delete:\n${userName}\n\nType "DELETE" in the prompt to confirm.`
    );

    if (!secondConfirm) return;

    const userInput = prompt('Type "DELETE" to confirm deletion:');
    if (userInput !== "DELETE") {
      alert("Deletion cancelled. You must type 'DELETE' exactly.");
      return;
    }

    try {
      const response = await api.delete(`/user/${userId}`);

      alert(`✅ ${userName} has been successfully deleted.`);
      console.log(response.data.message);

      // Reload data to reflect changes
      await loadStats();
      await loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);

      if (error.response?.status === 403) {
        alert("❌ Access denied. SuperAdmin privileges required.");
      } else if (error.response?.status === 404) {
        alert("❌ User not found.");
      } else if (error.response?.status === 400) {
        alert(`❌ ${error.response.data.message}`);
      } else {
        alert("❌ Failed to delete user. Please try again.");
      }
    }
  };

  // Change user role
  const changeUserRole = async (userId, newRole, userName) => {
    if (
      !confirm(
        `Are you sure you want to change ${userName}'s role to ${newRole}?`
      )
    ) {
      return;
    }

    try {
      await api.put(`/user/${userId}/role`, { role: newRole });
      alert(
        `${userName} has been ${
          newRole === "admin" ? "promoted to" : "demoted to"
        } ${newRole}`
      );

      // Reload data
      await loadStats();
      await loadUsers();
    } catch (error) {
      console.error("Failed to change user role:", error);
      alert("Failed to change user role");
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([loadStats(), loadUsers()]);
      setLoading(false);
    };
    initializeDashboard();
  }, [loadStats]);

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <div className="space-y-6">
            <UsersTable
              users={users}
              onRoleChange={changeUserRole}
              onDeleteUser={deleteUser}
              loading={loading}
            />
          </div>
        );

      case "analytics":
        return (
          <AnalyticsDashboard
            stats={stats}
            recentUsers={recentUsers}
            loading={loading}
          />
        );

      case "settings":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-gray-400 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Settings</h3>
            </div>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
