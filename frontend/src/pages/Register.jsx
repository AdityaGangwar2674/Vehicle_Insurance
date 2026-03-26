import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import {
  ShieldCheck,
  User as UserIcon,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const RoleCard = ({ selected, icon: Icon, label, desc, onClick }) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex-1 group ${
      selected
        ? "border-orange-500 bg-orange-500/5 shadow-lg shadow-orange-500/10"
        : "border-white/5 bg-white/5 hover:border-white/20"
    }`}
  >
    <div
      className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-colors ${
        selected
          ? "bg-orange-500 text-white"
          : "bg-white/5 text-slate-500 group-hover:text-slate-300"
      }`}
    >
      <Icon size={20} />
    </div>
    <h3
      className={`text-sm font-bold mb-1 ${selected ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}
    >
      {label}
    </h3>
    <p className="text-[10px] text-slate-500 leading-tight uppercase font-medium tracking-wider">
      {desc}
    </p>
  </motion.div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const { login, loading, setLoading } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/register", formData);

      if (response.success) {
        login(response.data.user);
        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: `Welcome to VehicleInsure, ${response.data.user.name}`,
          timer: 2000,
          showConfirmButton: false,
          background: "#1e293b",
          color: "#fff",
        });

        if (response.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px]"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300 font-bold italic text-white text-xl">
              VI
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-3">Join the Future</h1>
          <p className="text-slate-400">
            Protect your journey with smart insurance
          </p>
        </div>

        <div className="glass-card p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex items-start gap-3"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                Choose Your Role
              </label>
              <div className="flex gap-4">
                <RoleCard
                  selected={formData.role === "user"}
                  icon={UserIcon}
                  label="Customer"
                  desc="Manage My Portfolio"
                  onClick={() => setFormData({ ...formData, role: "user" })}
                />
                <RoleCard
                  selected={formData.role === "admin"}
                  icon={ShieldCheck}
                  label="Admin"
                  desc="System Oversight"
                  onClick={() => setFormData({ ...formData, role: "admin" })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                  Full Name
                </label>
                <div className="relative group">
                  <UserIcon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 peer-focus:text-orange-500 transition-colors"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Aditya Gangwar"
                    className="input-field w-full pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="input-field w-full pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors"
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field w-full pl-12"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-500 font-semibold hover:text-orange-400 transition-colors"
              >
                Sign in now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
