import { useState, useContext } from "react";
import {
  Menu,
  X,
  Bell,
  Settings as SettingsIcon,
  Users,
  Home,
  Globe,
  Store,
  Package,
  ClipboardList,
} from "lucide-react";
import { AuthContext } from "../../context/authContext.jsx";

export default function DashboardNavbar({ setCurrentView }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const role = user?.role || localStorage.getItem("role") || "user";

  // ============================
  // ROLE-BASED SIDE MENU
  // ============================

  const NAV_ITEMS = {
    superadmin: [
      { name: "Dashboard", view: "dashboard", icon: Home },
      { name: "Manage Users/Stores", view: "superadmin-users", icon: Users },
      { name: "Inventory", view: "inventory", icon: ClipboardList },
      { name: "Community", view: "community", icon: Globe },
      { name: "Settings", view: "settings", icon: SettingsIcon },
      { name: "Notifications", view: "notifications", icon: Bell },
    ],

    admin: [
      { name: "Dashboard", view: "dashboard", icon: Home },
      { name: "Store Users", view: "store-users", icon: Users },
      { name: "Inventory", view: "inventory", icon: ClipboardList },
      { name: "Community", view: "community", icon: Globe },
      { name: "Settings", view: "settings", icon: SettingsIcon },
      { name: "Notifications", view: "notifications", icon: Bell },
    ],

    user: [
      { name: "Dashboard", view: "dashboard", icon: Home },
      { name: "Stores", view: "stores", icon: Store },
      { name: "Products", view: "products", icon: Package },
      { name: "Inventory", view: "inventory", icon: ClipboardList },
      { name: "Community", view: "community", icon: Globe },
      { name: "Settings", view: "settings", icon: SettingsIcon },
      { name: "Notifications", view: "notifications", icon: Bell },
    ],
  };

  const menuItems = NAV_ITEMS[role];

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Announcement bar */}
      <div className="bg-violet-500 py-1 text-center text-white text-sm">
        🚀 Build beautiful stores with <span className="font-semibold">Hiveehub</span>
      </div>

      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          onClick={() => setCurrentView("dashboard")}
          className="text-2xl font-bold text-gray-900 cursor-pointer"
        >
          Hiveehub
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={index}
                onClick={() => setCurrentView(item.view)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-violet-700 transition"
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </button>
            );
          })}

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-violet-700 transition"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg p-4 space-y-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  setCurrentView(item.view);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-violet-700 transition"
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
            className="w-full bg-violet-600 text-white py-2 rounded-full hover:bg-violet-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
