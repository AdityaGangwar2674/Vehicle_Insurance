import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Car, 
  Clock, 
  Award, 
  ArrowRight, 
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="glass-card flex flex-col items-center text-center p-8 group overflow-hidden relative"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:scale-150 transition-transform duration-500" />
    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-300">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </motion.div>
);

const Navbar = () => (
  <nav className="h-20 absolute top-0 left-0 right-0 z-50 px-6 sm:px-12 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
        <ShieldCheck className="text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white italic">VehicleInsure</span>
    </div>

    <div className="flex items-center gap-8">
      <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">Login</Link>
      <Link to="/register" className="btn-primary py-2 px-6 text-sm">Get Started</Link>
    </div>
  </nav>
);

const HomePage = () => {
  return (
    <div className="bg-[#0f172a] text-slate-200 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-40 pb-20 px-6 sm:px-12 flex flex-col items-center justify-center overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-4xl text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-400 text-sm font-medium mb-8"
          >
            <Award size={16} />
            Rated #1 InsureTech platform in 2024
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl sm:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]"
          >
            Smarter Coverage for <span className="gradient-text italic font-black uppercase">Your Journey</span>.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Experience seamless vehicle insurance management with AI-backed insights, instant claim filing, and real-time policy tracking. Secure your future today.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/register" className="btn-primary flex items-center gap-3 group w-full sm:w-auto justify-center">
              Create Free Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-secondary w-full sm:w-auto justify-center">View Sample Policy</Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 flex flex-wrap justify-center items-center gap-8 text-slate-500"
          >
            <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-orange-500/50" /> 50k+ Active Users</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-orange-500/50" /> Instant Approvals</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-orange-500/50" /> 24/7 Support</div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 hidden sm:block"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 sm:px-12 max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">Designed for Modern Driving</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to manage your vehicle's protection in one intuitive interface.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Car}
            title="Vehicle Portfolio"
            desc="Add and manage multiple vehicles with detailed specifications and high-quality image logs."
            delay={0.1}
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="Premium Insurance"
            desc="Access flexible coverage options and customized policies tailored perfectly to your driving habits."
            delay={0.2}
          />
          <FeatureCard 
            icon={Clock}
            title="Lightning Fast Claims"
            desc="Document accidents and file claims in minutes. Our digital workflow ensures you never get lost in paperwork."
            delay={0.3}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-orange-500" />
            <span className="font-bold">VehicleInsure</span>
          </div>
          <p className="text-sm text-slate-500">© 2024 VehicleInsure Tech. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-slate-400">
            <a href="/" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
