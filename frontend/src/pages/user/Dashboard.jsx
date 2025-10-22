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
  Moon,
  Sun,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    role: "user",
  };

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const stats = [
    {
      title: "Active Policies",
      value: "3",
      change: "+2 this month",
      icon: Shield,
      color: "blue",
      trend: "up",
    },
    {
      title: "Total Claims",
      value: "12",
      change: "2 pending",
      icon: FileText,
      color: "green",
      trend: "neutral",
    },
    {
      title: "Pending Payments",
      value: "$2,450",
      change: "Due in 5 days",
      icon: CreditCard,
      color: "orange",
      trend: "neutral",
    },
    {
      title: "Registered Vehicles",
      value: "2",
      change: "All insured",
      icon: Car,
      color: "purple",
      trend: "neutral",
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

  const recentActivity = [
    {
      action: "Claim filed for vehicle damage",
      time: "2 hours ago",
      status: "pending",
      icon: AlertCircle,
      details: "Case #CLM-2024-001",
    },
    {
      action: "Policy renewal payment received",
      time: "1 day ago",
      status: "completed",
      icon: CheckCircle2,
      details: "Payment ID: PAY-789456",
    },
    {
      action: "New vehicle added to policy",
      time: "3 days ago",
      status: "completed",
      icon: Car,
      details: "Honda Civic 2023",
    },
    {
      action: "Document verification in progress",
      time: "5 days ago",
      status: "pending",
      icon: Clock,
      details: "Registration certificate",
    },
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
      background: isDark ? "#1e293b" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "Logged out!",
          text: "You have been logged out.",
          icon: "success",
          background: isDark ? "#1e293b" : "#ffffff",
          color: isDark ? "#ffffff" : "#000000",
        });
        navigate("/login");
      }
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-50 w-72 shadow-xl transform transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isDark
            ? "bg-slate-800 border-r border-slate-700"
            : "bg-white border-r border-gray-200"
        }`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-slate-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-2">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              SecureInsure
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-1 rounded-lg ${
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <motion.button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 mb-2 ${
                item.active
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50"
                  : isDark
                  ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        <div
          className={`p-4 border-t ${
            isDark ? "border-slate-700" : "border-gray-200"
          }`}
        >
          <motion.button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
              isDark
                ? "text-red-400 hover:bg-red-900/20"
                : "text-red-600 hover:bg-red-50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          className={`sticky top-0 z-30 backdrop-blur-md border-b ${
            isDark
              ? "bg-slate-800/80 border-slate-700"
              : "bg-white/80 border-gray-200"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className={`lg:hidden p-2 rounded-lg ${
                    isDark
                      ? "text-slate-400 hover:text-white hover:bg-slate-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Welcome back, {mockUser.name}!
                  </h1>
                  <p className={isDark ? "text-slate-400" : "text-gray-600"}>
                    Here's what's happening with your insurance
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`relative hidden md:block ${
                    isDark ? "text-slate-400" : "text-gray-400"
                  }`}
                >
                  <Search className="absolute left-3 top-3 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600 text-yellow-400"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <button
                  className={`p-2 rounded-xl relative transition-all ${
                    isDark
                      ? "text-slate-400 hover:text-white hover:bg-slate-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    3
                  </span>
                </button>

                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {mockUser.name}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-slate-400" : "text-gray-600"
                      }`}
                    >
                      {mockUser.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                className={`rounded-2xl p-6 transition-all duration-300 ${
                  isDark
                    ? "bg-slate-800 border border-slate-700 hover:border-slate-600"
                    : "bg-white border border-gray-200 hover:shadow-lg"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.trend === "up" && (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p
                  className={`text-sm font-medium mb-1 ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  {stat.title}
                </p>
                <p
                  className={`text-3xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stat.value}
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-slate-500" : "text-gray-500"
                  }`}
                >
                  {stat.change}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <motion.div
            className={`rounded-2xl p-6 ${
              isDark
                ? "bg-slate-800 border border-slate-700"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Recent Activity
              </h2>
              <button
                className={`text-sm font-medium ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700/50 hover:bg-slate-700"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activity.status === "pending"
                          ? "bg-orange-500/20"
                          : "bg-green-500/20"
                      }`}
                    >
                      <activity.icon
                        className={`w-5 h-5 ${
                          activity.status === "pending"
                            ? "text-orange-500"
                            : "text-green-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {activity.action}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p
                          className={`text-sm ${
                            isDark ? "text-slate-400" : "text-gray-600"
                          }`}
                        >
                          {activity.time}
                        </p>
                        <span
                          className={
                            isDark ? "text-slate-600" : "text-gray-400"
                          }
                        >
                          •
                        </span>
                        <p
                          className={`text-sm ${
                            isDark ? "text-slate-500" : "text-gray-500"
                          }`}
                        >
                          {activity.details}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === "pending"
                        ? isDark
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-orange-100 text-orange-800"
                        : isDark
                        ? "bg-green-500/20 text-green-400"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {activity.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {[
              {
                title: "File New Claim",
                desc: "Report an incident",
                icon: FileText,
                color: "blue",
                action: "/claims",
              },
              {
                title: "Add Vehicle",
                desc: "Register new vehicle",
                icon: Car,
                color: "purple",
                action: "/vehicles",
              },
              {
                title: "Make Payment",
                desc: "Pay premium online",
                icon: CreditCard,
                color: "green",
                action: "/payments",
              },
            ].map((action, index) => (
              <motion.button
                key={index}
                onClick={() => navigate(action.action)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                  isDark
                    ? "bg-slate-800 border border-slate-700 hover:border-slate-600"
                    : "bg-white border border-gray-200 hover:shadow-lg"
                }`}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${action.color}-500 to-${action.color}-600 flex items-center justify-center mb-4`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {action.title}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  {action.desc}
                </p>
              </motion.button>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
