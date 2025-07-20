import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Car, CreditCard } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-2xl font-bold">SecureInsure</span>
          </div>

          <motion.button
            onClick={() => navigate("/login")}
            className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Vehicle's
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Guardian Angel
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Comprehensive vehicle insurance management with instant claims
            processing, real-time tracking, and 24/7 customer support.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Get Started
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            {
              icon: Shield,
              title: "Instant Claims",
              desc: "File and track claims in real-time",
            },
            {
              icon: Car,
              title: "Vehicle Management",
              desc: "Manage all your vehicles in one place",
            },
            {
              icon: CreditCard,
              title: "Easy Payments",
              desc: "Secure and flexible payment options",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-blue-100">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
