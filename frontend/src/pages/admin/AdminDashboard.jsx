import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  Users,
  Car,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Activity,
  UserPlus,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const GlobalStat = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="glass-card flex flex-col gap-4 border-white/5 hover:border-white/10"
  >
    <div className="flex justify-between items-start">
      <div
        className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-500`}
      >
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
        <TrendingUp size={10} /> Live
      </div>
    </div>
    <div>
      <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-1">
        {title}
      </p>
      <h3 className="text-3xl font-black text-white italic tracking-tighter">
        {value}
      </h3>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    vehicles: 0,
    insurances: 0,
    payments: 0,
    revenue: 0,
    pendingClaims: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchGlobalStats = async () => {
    try {
      setLoading(true);
      const [uRes, vRes, iRes, pRes, cRes] = await Promise.all([
        api.get("/auth/users"),
        api.get("/vehicles"),
        api.get("/insurance"),
        api.get("/payment"),
        api.get("/claim"),
      ]);

      const totalRevenue = (pRes.data || []).reduce(
        (acc, curr) => acc + (curr.amountPaid || 0),
        0,
      );
      const pendingClaims = (cRes.data || []).filter(
        (c) => c.claimStatus === "pending",
      ).length;

      setStats({
        users: uRes.data?.length || 0,
        vehicles: vRes.data?.length || 0,
        insurances: iRes.data?.length || 0,
        payments: pRes.data?.length || 0,
        revenue: totalRevenue,
        pendingClaims: pendingClaims,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalStats();
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
            Admin Control Center
          </h1>
          <p className="text-slate-400 font-medium">
            Global system overview and policy management engine.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl glass border border-white/5 flex items-center gap-3">
            <Zap size={18} className="text-orange-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 italic">
              Core Processing Active
            </span>
          </div>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <GlobalStat
          title="Total Customers"
          value={stats.users}
          icon={Users}
          color="blue"
          delay={0.1}
        />
        <GlobalStat
          title="Global Gross (₹)"
          value={stats.revenue.toLocaleString()}
          icon={CreditCard}
          color="emerald"
          delay={0.2}
        />
        <GlobalStat
          title="Total Assets"
          value={stats.vehicles}
          icon={Car}
          color="indigo"
          delay={0.3}
        />
        <GlobalStat
          title="Active Policies"
          value={stats.insurances}
          icon={ShieldCheck}
          color="orange"
          delay={0.4}
        />
      </div>

      {/* Complex Layout Management */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 relative overflow-hidden group">
            <Activity className="absolute bottom-[-20%] right-[-5%] text-white/5 w-64 h-64 rotate-[-15deg] group-hover:scale-110 group-hover:rotate-0 transition-transform duration-1000" />

            <div className="relative z-10 space-y-6">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                <AlertTriangle
                  size={32}
                  className="text-rose-500 animate-bounce"
                />{" "}
                {stats.pendingClaims} Pending Claim Requests
              </h2>
              <p className="text-slate-400 max-w-md leading-relaxed">
                Incoming incident reports require your immediate validation.
                Finalize status to maintain system integrity.
              </p>

              <Link
                to="/admin/claims"
                className="btn-primary inline-flex items-center gap-3 px-10 py-4 bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/25 border-none"
              >
                Review Approval Queue <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <Link
              to="/admin/customers"
              className="glass-card hover:border-blue-500/30 transition-all block group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <UserPlus size={24} />
                </div>
                <ArrowRight
                  size={20}
                  className="text-slate-700 group-hover:translate-x-1 transition-transform"
                />
              </div>
              <h3 className="text-lg font-black text-white italic uppercase tracking-tight">
                Customer Database
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                {stats.users} Records Found
              </p>
            </Link>

            <Link
              to="/admin/payments"
              className="glass-card hover:border-emerald-500/30 transition-all block group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <CreditCard size={24} />
                </div>
                <ArrowRight
                  size={20}
                  className="text-slate-700 group-hover:translate-x-1 transition-transform"
                />
              </div>
              <h3 className="text-lg font-black text-white italic uppercase tracking-tight">
                Financial Ledger
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                Latest: ₹0 Transaction
              </p>
            </Link>
          </div>
        </div>

        {/* Priority Actions */}
        <div className="space-y-6 flex flex-col">
          <div className="glass-card flex-1 border-orange-500/20 bg-orange-500/5">
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-6">
              Quick Issuance
            </h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mb-8 leading-relaxed">
              Manually generate or link insurance policies to verified
              customers.
            </p>

            <Link
              to="/admin/customers"
              className="w-full py-4 rounded-xl bg-white text-slate-950 font-black italic uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all"
            >
              Manage Portfolios <Zap size={18} />
            </Link>
          </div>

          <div className="p-1 w-full bg-slate-800/50 rounded-2xl flex items-center justify-center text-xs font-black uppercase tracking-[0.3em] text-slate-600 border border-white/5 py-4 italic">
            Automated Audit Log Enabled
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
