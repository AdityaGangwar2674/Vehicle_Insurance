import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Swal from "sweetalert2";
import axios from "axios";
import { motion } from "framer-motion";
import { Shield, Moon, Sun, Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      console.log("✅ Login response:", res.data);

      login(res.data.user, res.data.token);
      Swal.fire({
        title: "Success",
        text: "Logged in successfully!",
        icon: "success",
        background: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000",
      });
      navigate("/dashboard");
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Login failed",
        icon: "error",
        background: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000",
      });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      }`}
    >
      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-xl transition-all duration-300 z-50 ${
          isDark
            ? "bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700"
            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      <motion.div
        className={`relative rounded-3xl p-8 w-full max-w-md border transition-all duration-300 ${
          isDark
            ? "bg-slate-800 border-slate-700 shadow-2xl shadow-blue-900/20"
            : "bg-white border-gray-200 shadow-xl"
        }`}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/50"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h2
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome Back
          </h2>
          <p className={isDark ? "text-slate-400" : "text-gray-600"}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-gray-700"
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className={`absolute left-3 top-3 w-5 h-5 ${
                  isDark ? "text-slate-500" : "text-gray-400"
                }`}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
                placeholder="Enter your email"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-3 top-3 w-5 h-5 ${
                  isDark ? "text-slate-500" : "text-gray-400"
                }`}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
                placeholder="Enter your password"
                required
              />
            </div>
          </motion.div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span
                className={`ml-2 text-sm ${
                  isDark ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Remember me
              </span>
            </label>
            <button
              type="button"
              className={`text-sm font-medium ${
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Forgot password?
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className={isDark ? "text-slate-400" : "text-gray-600"}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className={`font-semibold cursor-pointer transition-colors duration-300 ${
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Sign up
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
