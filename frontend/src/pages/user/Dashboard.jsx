import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { 
  ShieldCheck, 
  Car, 
  CreditCard, 
  AlertTriangle,
  ArrowRight,
  Plus,
  UserCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card flex items-center gap-6"
  >
    <div className={`w-14 h-14 rounded-2xl bg-${color}-500/10 flex items-center justify-center text-${color}-500`}>
      <Icon size={28} />
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    vehicles: 0,
    insurances: 0,
    payments: 0,
    claims: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch Profile
      const profRes = await api.get("/customers/me");
      if (profRes.success) setProfile(profRes.data);

      // Fetch Stats
      const [vRes, iRes, pRes, cRes] = await Promise.all([
        api.get("/vehicles/me"),
        api.get("/insurance/me"),
        api.get("/payment/me"),
        api.get("/claim/me")
      ]);

      setStats({
        vehicles: vRes.data?.length || 0,
        insurances: iRes.data?.length || 0,
        payments: pRes.data?.length || 0,
        claims: cRes.data?.length || 0
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    const { value: formValues } = await Swal.fire({
      title: "Complete Your Profile",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Phone Number" type="tel">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Address">',
      focusConfirm: false,
      background: "#1e293b",
      color: "#fff",
      confirmButtonColor: "#f97316",
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value
        ];
      }
    });

    if (formValues && formValues[0] && formValues[1]) {
      try {
        const res = await api.post("/customers", {
          phone: formValues[0],
          address: formValues[1]
        });
        if (res.success) {
          Swal.fire("Success!", "Profile created.", "success");
          setProfile(res.data);
        }
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hello, {user?.name} 👋</h1>
          <p className="text-slate-400">Everything looks good with your protection today.</p>
        </div>
        {!profile && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateProfile}
            className="flex items-center gap-3 px-6 py-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl font-semibold hover:bg-orange-500/20 transition-all"
          >
            <UserCheck size={20} /> Complete Profile
          </motion.button>
        )}
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Vehicles" value={stats.vehicles} icon={Car} color="blue" delay={0.1} />
        <StatCard title="Policies" value={stats.insurances} icon={ShieldCheck} color="green" delay={0.2} />
        <StatCard title="Total Payments" value={stats.payments} icon={CreditCard} color="orange" delay={0.3} />
        <StatCard title="Active Claims" value={stats.claims} icon={AlertTriangle} color="rose" delay={0.4} />
      </div>

      {/* Main Sections */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="glass-card">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link to="/vehicles" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 hover:bg-white/10 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Plus size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">Register Vehicle</p>
                    <p className="text-xs text-slate-500">Add to your portfolio</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link to="/claims" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-rose-500/30 hover:bg-white/10 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">Report Incident</p>
                    <p className="text-xs text-slate-500">Fast-track claim filing</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {!profile && (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-500 to-rose-500 relative overflow-hidden group shadow-2xl shadow-orange-500/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 uppercase">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2 italic">Profile Incomplete</h3>
                  <p className="text-white/80 text-sm max-w-sm">Complete your profile to unlock insurance applications and claim filing features.</p>
                </div>
                <button 
                  onClick={handleCreateProfile}
                  className="px-8 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-lg shadow-black/10"
                >
                  Start Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Mini Section */}
        <div className="glass-card h-fit">
          <h2 className="text-xl font-bold mb-6">Recent Updates</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1 h-12 bg-orange-500 rounded-full shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">System Update</p>
                <p className="text-xs text-slate-400">IDV Calculator now supports EV vehicles.</p>
              </div>
            </div>
            <div className="flex gap-4 opacity-50">
              <div className="w-1 h-12 bg-slate-700 rounded-full shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-400">Policy Alert</p>
                <p className="text-xs text-slate-500">You have no active policies. Consider adding one.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
