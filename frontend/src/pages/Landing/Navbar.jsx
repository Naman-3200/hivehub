// import { useState } from 'react';
// import { ArrowRight, Menu, X } from 'lucide-react';



// export default function Navbar() {
//   // --- State to manage mobile menu visibility ---
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [currentView, setCurrentView] = useState('landing'); // 'superadmin-dashboard', 'superadmin-users', 'store-users', etc.
//   const role = JSON.parse(localStorage.getItem("user") || "{}")?.role || localStorage.getItem("role") || "user";


//   return (
//     <div className="sticky top-0 z-50 bg-white text-gray-800 border-b-2 border-gray-200">
//       <div className=' bg-violet-500 py-1 top-0 text-center text-white'>NEW: Build your store in minutes with Hivehub and go live!</div>

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">

//         {/* --- Properly Responsive Header --- */}
//         <header className="relative z-50">
//           <div className="flex items-center justify-between">
//             {/* Logo */}
//             <div className="text-2xl md:text-4xl font-semibold text-black">Hivehub</div>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center gap-4">
//               <nav className="flex items-center gap-x-6 bg-gray-800 rounded-full px-6 py-3">
//                 <a href="#" className="text-gray-200 hover:text-black text-sm font-medium">Home</a>
//                 <a href="#" className="text-gray-200 hover:text-black text-sm font-medium">Collection</a>
//                 <a href="#" className="text-gray-200 hover:text-black text-sm font-medium">About Us</a>
//                 <a href="#" className="text-gray-200 hover:text-black text-sm font-medium">Contact Us</a>
//               </nav>
//             </div>

//             {currentView === 'store-users' && <StoreUsersPage storeId={selectedStore?._id || selectedStore?.id} />}

// {currentView === 'superadmin-dashboard' && <SuperAdminDashboard />}
// {currentView === 'superadmin-users' && <SuperAdminUsers />}


//             {role === "superadmin" && (
//   <>
//     <button onClick={()=>setCurrentView('superadmin-dashboard')} className="px-3 py-2 text-sm font-medium">Super Admin</button>
//     <button onClick={()=>setCurrentView('superadmin-users')} className="px-3 py-2 text-sm font-medium">Manage Users/Stores</button>
//   </>
// )}

// {role === "admin" && (
//   <button onClick={()=>setCurrentView('store-users')} className="px-3 py-2 text-sm font-medium">Store Users</button>
// )}

//             <button className="hidden lg:flex bg-black text-white px-6 py-3 rounded-full text-sm font-medium items-center space-x-2 hover:bg-gray-900">
//               <span>Contact Us</span>
//               <ArrowRight size={16} />
//             </button>
//             {/* Mobile Menu Button (Hamburger) */}
//             <div className="md:hidden">
//               <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
//                 {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu Panel */}
//           {isMenuOpen && (
//             <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg mt-2 p-5">
//               <nav className="flex flex-col items-center gap-4">
//                 <a href="#" className="text-gray-700 hover:text-black text-base font-medium">Home</a>
//                 <a href="#" className="text-gray-700 hover:text-black text-base font-medium">Collection</a>
//                 <a href="#" className="text-gray-700 hover:text-black text-base font-medium">About Us</a>
//                 <a href="#" className="text-gray-700 hover:text-black text-base font-medium">Contact Us</a>
//               </nav>
//               <button className="mt-6 w-full bg-black text-white px-6 py-3 rounded-full text-sm font-medium flex items-center justify-center space-x-2 hover:bg-gray-900">
//                 <span>Contact Us</span>
//                 {/* <ArrowRight size={16} /> */}
//               </button>
//             </div>
//           )}
//         </header>

      
//       </div>
//     </div>
//   );
// }













// import { useState } from "react";
// import { ArrowRight, Menu, X } from "lucide-react";

// // Import your subpages
// import SuperAdminDashboard from "../pages/SuperAdminDashboard";
// import SuperAdminUsers from "../pages/SuperAdminUsers";
// import StoreUsersPage from "../pages/StoreUsersPage";

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [currentView, setCurrentView] = useState("landing"); // default page
//   const [selectedStore, setSelectedStore] = useState(null);

//   // Get user role
//   const role =
//     JSON.parse(localStorage.getItem("user") || "{}")?.role ||
//     localStorage.getItem("role") ||
//     "user";

//   // Render page content based on role + view
//   const renderContent = () => {
//     if (role === "superadmin") {
//       if (currentView === "superadmin-dashboard") return <SuperAdminDashboard />;
//       if (currentView === "superadmin-users") return <SuperAdminUsers />;
//     }

//     if (role === "admin") {
//       if (currentView === "store-users")
//         return (
//           <StoreUsersPage
//             storeId={selectedStore?._id || selectedStore?.id || ""}
//           />
//         );
//     }

//     // Default landing page (or fallback)
//     return (
//       <div className="flex justify-center items-center min-h-[70vh] text-gray-500">
//         <h2 className="text-lg font-semibold">
//           Welcome to <span className="text-violet-600">Hivehub</span> 🚀
//         </h2>
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <div className="sticky top-0 z-50 bg-white text-gray-800 border-b-2 border-gray-200">
//         {/* Announcement bar */}
//         <div className="bg-violet-500 py-1 text-center text-white text-sm">
//           NEW: Build your store in minutes with Hivehub and go live!
//         </div>

//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <header className="relative z-50">
//             <div className="flex items-center justify-between">
//               {/* Logo */}
//               <div
//                 className="text-2xl md:text-4xl font-semibold text-black cursor-pointer"
//                 onClick={() => setCurrentView("landing")}
//               >
//                 Hivehub
//               </div>

//               {/* Desktop Menu */}
//               <div className="hidden md:flex items-center gap-4">
//                 <nav className="flex items-center gap-x-6 bg-gray-800 rounded-full px-6 py-3">
//                   <button
//                     onClick={() => setCurrentView("landing")}
//                     className="text-gray-200 hover:text-white text-sm font-medium"
//                   >
//                     Home
//                   </button>
//                   <button
//                     onClick={() => alert("Coming soon!")}
//                     className="text-gray-200 hover:text-white text-sm font-medium"
//                   >
//                     Collection
//                   </button>
//                   <button
//                     onClick={() => alert("Coming soon!")}
//                     className="text-gray-200 hover:text-white text-sm font-medium"
//                   >
//                     About Us
//                   </button>
//                   <button
//                     onClick={() => alert("Coming soon!")}
//                     className="text-gray-200 hover:text-white text-sm font-medium"
//                   >
//                     Contact Us
//                   </button>
//                 </nav>

//                 {/* Role-Based Buttons */}
//                 {role === "superadmin" && (
//                   <>
//                     <button
//                       onClick={() => setCurrentView("superadmin-dashboard")}
//                       className={`px-3 py-2 text-sm font-medium rounded-md ${
//                         currentView === "superadmin-dashboard"
//                           ? "bg-violet-600 text-white"
//                           : "text-gray-700 hover:text-violet-600"
//                       }`}
//                     >
//                       Super Admin
//                     </button>

//                     <button
//                       onClick={() => setCurrentView("superadmin-users")}
//                       className={`px-3 py-2 text-sm font-medium rounded-md ${
//                         currentView === "superadmin-users"
//                           ? "bg-violet-600 text-white"
//                           : "text-gray-700 hover:text-violet-600"
//                       }`}
//                     >
//                       Manage Users/Stores
//                     </button>
//                   </>
//                 )}

//                 {role === "admin" && (
//                   <button
//                     onClick={() => setCurrentView("store-users")}
//                     className={`px-3 py-2 text-sm font-medium rounded-md ${
//                       currentView === "store-users"
//                         ? "bg-violet-600 text-white"
//                         : "text-gray-700 hover:text-violet-600"
//                     }`}
//                   >
//                     Store Users
//                   </button>
//                 )}

//                 {/* Contact Us button */}
//                 <button className="hidden lg:flex bg-black text-white px-6 py-3 rounded-full text-sm font-medium items-center space-x-2 hover:bg-gray-900">
//                   <span>Contact Us</span>
//                   <ArrowRight size={16} />
//                 </button>
//               </div>

//               {/* Mobile Hamburger */}
//               <div className="md:hidden">
//                 <button
//                   onClick={() => setIsMenuOpen(!isMenuOpen)}
//                   aria-label="Toggle menu"
//                 >
//                   {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//                 </button>
//               </div>
//             </div>

//             {/* Mobile Menu */}
//             {isMenuOpen && (
//               <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg mt-2 p-5">
//                 <nav className="flex flex-col items-center gap-4">
//                   <button
//                     onClick={() => setCurrentView("landing")}
//                     className="text-gray-700 hover:text-violet-600 text-base font-medium"
//                   >
//                     Home
//                   </button>
//                   {role === "superadmin" && (
//                     <>
//                       <button
//                         onClick={() => setCurrentView("superadmin-dashboard")}
//                         className="text-gray-700 hover:text-violet-600 text-base font-medium"
//                       >
//                         Super Admin
//                       </button>
//                       <button
//                         onClick={() => setCurrentView("superadmin-users")}
//                         className="text-gray-700 hover:text-violet-600 text-base font-medium"
//                       >
//                         Manage Users/Stores
//                       </button>
//                     </>
//                   )}
//                   {role === "admin" && (
//                     <button
//                       onClick={() => setCurrentView("store-users")}
//                       className="text-gray-700 hover:text-violet-600 text-base font-medium"
//                     >
//                       Store Users
//                     </button>
//                   )}
//                 </nav>
//               </div>
//             )}
//           </header>
//         </div>
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <main className="container mx-auto px-6 py-10">{renderContent()}</main>
//     </>
//   );
// }






// import { useState, useContext } from "react";
// import {
//   ArrowRight,
//   Menu,
//   X,
//   Bell,
//   Settings,
//   Users,
//   Home,
//   Globe,
//   Store,
//   Package,
//   ClipboardList
// } from "lucide-react";
// import { AuthContext } from "../../context/authContext.jsx";
// import { useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const role = user?.role || localStorage.getItem("role") || "user";

//   console.log("🧭 Navbar loaded for role:", role);

//   const menuItems = [];

//   // === 🧠 Role-based menu entries ===
//   if (role === "superadmin") {
//     menuItems.push(
//       { name: "Dashboard", icon: <Home size={16} />, onClick: () => navigate("/superadmin-dashboard") },
//       { name: "Manage Users/Stores", icon: <Users size={16} />, onClick: () => navigate("/superadmin-users") },
//       { name: "Community", icon: <Globe size={16} />, onClick: () => navigate("/community") },
//       { name: "Settings", icon: <Settings size={16} />, onClick: () => navigate("/settings") },
//       { name: "Inventory", path: "/inventory", icon: <ClipboardList size={16} /> },
//       { name: "Notifications", icon: <Bell size={16} />, onClick: () => navigate("/notifications") }
//     );
//   } else if (role === "admin") {
//     menuItems.push(
//       { name: "Dashboard", icon: <Home size={16} />, onClick: () => navigate("/dashboard") },
//       { name: "Store Users", icon: <Users size={16} />, onClick: () => navigate("/store-users") },
//       { name: "Community", icon: <Globe size={16} />, onClick: () => navigate("/community") },
//       { name: "Inventory", path: "/inventory", icon: <ClipboardList size={16} /> },
//       { name: "Settings", icon: <Settings size={16} />, onClick: () => navigate("/settings") }
//     );
//   } else {
//     // === User role ===
//     menuItems.push(
//       { name: "Dashboard", icon: <Home size={16} />, onClick: () => navigate("/dashboard") },
//       { name: "Stores", icon: <Store size={16} />, onClick: () => navigate("/stores") },
//       { name: "Products", icon: <Package size={16} />, onClick: () => navigate("/products") },
//       { name: "Inventory", path: "/inventory", icon: <ClipboardList size={16} /> },
//       { name: "Community", icon: <Globe size={16} />, onClick: () => navigate("/community") },
//       { name: "Settings", icon: <Settings size={16} />, onClick: () => navigate("/settings") }
//     );
//   }

//   return (
//     <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
//       <div className="bg-violet-500 py-1 text-center text-white text-sm">
//         🚀 Build your store in minutes with <span className="font-semibold">Hivehub</span> and go live!
//       </div>

//       <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//         {/* Logo */}
//         <h1
//           onClick={() => navigate("/dashboard")}
//           className="text-2xl font-bold text-gray-900 cursor-pointer"
//         >
//           Hivehub
//         </h1>

//         {/* Desktop Menu */}
//         <nav className="hidden md:flex items-center space-x-6">
//           {menuItems.map((item, i) => (
//             <button
//               key={i}
//               onClick={item.onClick}
//               className="flex items-center gap-2 text-gray-700 hover:text-violet-700 transition"
//             >
//               {item.icon}
//               <span className="text-sm font-medium">{item.name}</span>
//             </button>
//           ))}

//           {/* Logout Button */}
//           <button
//             onClick={logout}
//             className="bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-violet-700 transition"
//           >
//             Logout
//           </button>
//         </nav>

//         {/* Mobile Menu Button */}
//         <div className="md:hidden">
//           <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Dropdown */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-white border-t shadow-lg p-4 space-y-4">
//           {menuItems.map((item, i) => (
//             <button
//               key={i}
//               onClick={() => {
//                 item.onClick();
//                 setIsMenuOpen(false);
//               }}
//               className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-violet-700 transition"
//             >
//               {item.icon}
//               <span>{item.name}</span>
//             </button>
//           ))}

//           <button
//             onClick={() => {
//               logout();
//               setIsMenuOpen(false);
//             }}
//             className="w-full bg-violet-600 text-white py-2 rounded-full hover:bg-violet-700 transition"
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

























import { useState, useContext } from "react";
import {
  ArrowRight,
  Menu,
  X,
  Bell,
  Settings,
  Users,
  Home,
  Globe,
  Store,
  Package,
  ClipboardList,
} from "lucide-react";
import { AuthContext } from "../../context/authContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role || localStorage.getItem("role") || "user";
  console.log("🧭 Navbar loaded for role:", role);

  const menuItems = [];

  // === 🧠 Role-based menu entries ===
  if (role === "superadmin") {
    menuItems.push(
      { name: "Dashboard", path: "/superadmin-dashboard", icon: <Home size={16} /> },
      { name: "Manage Users/Stores", path: "/superadmin-users", icon: <Users size={16} /> },
      { name: "Inventory", path: "/inventory", icon: <ClipboardList size={16} /> },
      { name: "Community", path: "/community", icon: <Globe size={16} /> },
      { name: "Settings", path: "/settings", icon: <Settings size={16} /> },
      { name: "Notifications", path: "/notifications", icon: <Bell size={16} /> }
    );
  } else if (role === "admin") {
    menuItems.push(
      { name: "Dashboard", path: "/dashboard", icon: <Home size={16} /> },
      { name: "Store Users", path: "/store-users", icon: <Users size={16} /> },
      { name: "Inventory", path: "/inventory", icon: <ClipboardList size={16} /> },
      { name: "Community", path: "/community", icon: <Globe size={16} /> },
      { name: "Settings", path: "/settings", icon: <Settings size={16} /> }
    );
  } else {
    // === User role ===
    menuItems.push(
      { name: "Dashboard", path: "/dashboard", icon: <Home size={16} /> },
      { name: "Stores", path: "/stores", icon: <Store size={16} /> },
      { name: "Products", path: "/products", icon: <Package size={16} /> },
      { name: "Inventory", path: "/inventory", icon: <ClipboardList size={16} /> },
      { name: "Community", path: "/community", icon: <Globe size={16} /> },
      { name: "Settings", path: "/settings", icon: <Settings size={16} /> }
    );
  }

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="bg-violet-500 py-1 text-center text-white text-sm">
        🚀 Build your store in minutes with <span className="font-semibold">Hivehub</span> and go live!
      </div>

      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-2xl font-bold text-gray-900 cursor-pointer"
        >
          Hivehub
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2 text-sm font-medium transition ${
                isActive(item.path)
                  ? "text-violet-700 font-semibold"
                  : "text-gray-700 hover:text-violet-700"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}

          {/* Logout Button */}
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
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                navigate(item.path);
                setIsMenuOpen(false);
              }}
              className={`flex items-center gap-3 w-full text-left transition ${
                isActive(item.path)
                  ? "text-violet-700 font-semibold"
                  : "text-gray-700 hover:text-violet-700"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}

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
