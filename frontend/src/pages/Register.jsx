import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      console.log("✅ Registration response:", res.data);
      Swal.fire("Success", "Account created successfully", "success");
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Registration failed",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>

      <motion.div
        className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-purple-100">Join SecureInsure today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            {
              name: "name",
              label: "Full Name",
              type: "text",
              placeholder: "Enter your full name",
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "Enter your email",
            },
            {
              name: "password",
              label: "Password",
              type: "password",
              placeholder: "Create a password",
            },
          ].map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <label className="block text-white text-sm font-medium mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder={field.placeholder}
                required
              />
            </motion.div>
          ))}

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-purple-100">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-purple-400 hover:text-purple-300 cursor-pointer font-semibold transition-colors duration-300"
            >
              Sign in
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
