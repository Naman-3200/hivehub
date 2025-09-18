import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Shield,
  ShieldCheck,
  UserPlus,
  TrendingUp,
  Activity,
  Calendar,
  Database,
} from "lucide-react";

export default function AnalyticsDashboard({ stats, recentUsers, loading }) {
  const userRoleData = [
    {
      name: "Users",
      value: stats.totalUsers - stats.totalAdmins - stats.totalSuperAdmins,
      color: "#3B82F6",
    },
    { name: "Admins", value: stats.totalAdmins, color: "#10B981" },
    { name: "SuperAdmins", value: stats.totalSuperAdmins, color: "#8B5CF6" },
  ];

  const growthData = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 150 },
    { month: "Mar", users: 180 },
    { month: "Apr", users: 220 },
    { month: "May", users: 280 },
    { month: "Jun", users: stats.totalUsers },
  ];

  const activityData = [
    { day: "Mon", registrations: 12, logins: 45 },
    { day: "Tue", registrations: 8, logins: 52 },
    { day: "Wed", registrations: 15, logins: 38 },
    { day: "Thu", registrations: 22, logins: 65 },
    { day: "Fri", registrations: 18, logins: 48 },
    { day: "Sat", registrations: 5, logins: 25 },
    { day: "Sun", registrations: 3, logins: 18 },
  ];

  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    backgroundColor,
    iconColor,
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-sm font-medium text-green-600">
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${backgroundColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          change="+12% this month"
          backgroundColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Admins"
          value={stats.totalAdmins}
          icon={Shield}
          change="+2 this week"
          backgroundColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          title="SuperAdmins"
          value={stats.totalSuperAdmins}
          icon={ShieldCheck}
          backgroundColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="New Today"
          value={stats.usersToday}
          icon={UserPlus}
          change="vs 8 yesterday"
          backgroundColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                User Growth
              </h3>
              <p className="text-sm text-gray-500">
                Monthly user registrations
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient
                  id="userGrowthGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#userGrowthGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Role Distribution
              </h3>
              <p className="text-sm text-gray-500">User roles breakdown</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {userRoleData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {entry.name}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Weekly Activity
              </h3>
              <p className="text-sm text-gray-500">Registrations vs logins</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={activityData} barGap={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar
                dataKey="registrations"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="logins" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm font-medium text-gray-700">
                Registrations
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm font-medium text-gray-700">Logins</span>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Users
              </h3>
              <p className="text-sm text-gray-500">Latest registrations</p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Calendar className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="space-y-4 max-h-72 overflow-y-auto">
            {recentUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
