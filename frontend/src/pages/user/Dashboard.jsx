import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Car,
  CreditCard,
  FileText,
  LogOut,
  User,
  Bell,
  Search,
  Menu,
  X,
  Home,
  Settings,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    role: "user",
  };

  // If no user is logged in, redirect
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const stats = [
    {
      title: "Active Policies",
      value: "3",
      icon: Shield,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Claims",
      value: "12",
      icon: FileText,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Pending Payments",
      value: "$2,450",
      icon: CreditCard,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Vehicles",
      value: "2",
      icon: Car,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", active: true },
    { icon: Shield, label: "Insurance", path: "/insurance" },
    { icon: FileText, label: "Claims", path: "/claims" },
    { icon: Car, label: "Vehicles", path: "/vehicles" },
    { icon: CreditCard, label: "Payments", path: "/payments" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire("Logged out!", "You have been logged out.", "success");
        navigate("/login");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-gray-800 opacity-75"
              onClick={() => setSidebarOpen(false)}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        initial={{ x: -264 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-2">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              SecureInsure
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4">
          {sidebarItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 mb-2 ${
                  item.active
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </motion.div>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <motion.header
          className="bg-white shadow-sm border-b border-gray-200 p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome back, {mockUser.name}!
                </h1>
                <p className="text-gray-600">
                  Here's what's happening with your insurance
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {mockUser.name}
                  </p>
                  <p className="text-xs text-gray-600">{mockUser.email}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[
                {
                  action: "Claim filed for vehicle damage",
                  time: "2 hours ago",
                  status: "pending",
                },
                {
                  action: "Policy renewal payment received",
                  time: "1 day ago",
                  status: "completed",
                },
                {
                  action: "New vehicle added to policy",
                  time: "3 days ago",
                  status: "completed",
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        activity.status === "pending"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === "pending"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {activity.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
