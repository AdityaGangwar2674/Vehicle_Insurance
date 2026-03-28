import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Car, 
  ShieldCheck, 
  CreditCard, 
  AlertTriangle, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SidebarItem = ({ icon: Icon, label, path, active, onClick }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25" 
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`}
  >
    <Icon size={20} className={active ? "" : "group-hover:scale-110 transition-transform"} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="h-20 glass border-b border-white/10 sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-slate-400"
        >
          <Menu size={24} />
        </button>
        <span className="text-xl font-bold gradient-text hidden sm:block">
          VehicleInsure
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative p-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
        </div>
        
        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white ring-2 ring-white/10">
            <UserIcon size={20} />
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg text-slate-400 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const menuItems = isAdmin ? [
    { icon: LayoutDashboard, label: "Admin Panel", path: "/admin/dashboard" },
    { icon: UserIcon, label: "Customers", path: "/admin/customers" },
    { icon: ShieldCheck, label: "Manage Policies", path: "/admin/insurance" },
    { icon: AlertTriangle, label: "Manage Claims", path: "/admin/claims" },
    { icon: CreditCard, label: "All Payments", path: "/admin/payments" },
  ] : [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Car, label: "My Vehicles", path: "/vehicles" },
    { icon: ShieldCheck, label: "Insurance", path: "/insurance" },
    { icon: CreditCard, label: "Payments", path: "/payments" },
    { icon: AlertTriangle, label: "My Claims", path: "/claims" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-5rem)] glass border-r border-white/10 p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Menu</p>
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.path} 
                {...item} 
                active={location.pathname === item.path} 
              />
            ))}
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              />
              <motion.aside 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-72 glass border-r border-white/10 z-[60] p-6 lg:hidden flex flex-col"
              >
                <div className="flex items-center justify-between mb-8 px-4">
                  <span className="text-xl font-bold gradient-text">VehicleInsure</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400">
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {menuItems.map((item) => (
                    <SidebarItem 
                      key={item.path} 
                      {...item} 
                      active={location.pathname === item.path} 
                      onClick={() => setSidebarOpen(false)}
                    />
                  ))}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950/50 p-6 lg:p-10 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
