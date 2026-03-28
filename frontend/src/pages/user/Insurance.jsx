import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { 
  ShieldCheck, 
  Plus, 
  Car, 
  Calendar, 
  CreditCard,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "pending payment": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    expired: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    cancelled: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };
  return (
    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
};

const INSURANCE_PLANS = {
  comprehensive: {
    premium: 12500,
    benefits: [
      "24/7 Roadside Assistance",
      "Cashless Repairs at 5000+ garages",
      "Third Party Liability Coverage",
      "Natural Disaster Protection",
      "Zero Depreciation Add-on"
    ]
  },
  "third-party": {
    premium: 4200,
    benefits: [
      "Mandatory Liability Guard",
      "Legal Defense Costs Coverage",
      "Unlimited Injury Liability",
      "Property Damage up to ₹7.5L"
    ]
  },
  "own damage": {
    premium: 8800,
    benefits: [
      "Accidental Internal Loss Shield",
      "Fire & Theft Security",
      "Animal Impact Protection",
      "Vandalism & Riots Cover"
    ]
  },
  "personal accident": {
    premium: 2100,
    benefits: [
      "Driver Accidental Injury Cover",
      "Child Seat Protection",
      "Hospital Cashless Daily Allowance",
      "Passenger Shield Add-on"
    ]
  }
};

const Insurance = () => {
  const [insurances, setInsurances] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleId: "",
    insuranceType: "comprehensive",
    insuranceProvider: "SecureInsure Global",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    premiumAmount: INSURANCE_PLANS.comprehensive.premium,
  });

  const updateType = (type) => {
    setFormData({
      ...formData,
      insuranceType: type,
      premiumAmount: INSURANCE_PLANS[type].premium
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [iRes, vRes] = await Promise.all([
        api.get("/insurance/me"),
        api.get("/vehicles/me")
      ]);
      if (iRes.success) setInsurances(iRes.data);
      if (vRes.success) setVehicles(vRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.vehicleId) return Swal.fire("Required", "Please select a vehicle", "warning");

    try {
      // Auto-generate a dummy policy number for demo if not handled by backend
      const policyNumber = "POL-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      const res = await api.post("/insurance", { ...formData, policyNumber });
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted",
          text: "Policy created. Please proceed to payment to activate it.",
          confirmButtonText: "Pay Now",
          showCancelButton: true,
          background: "#1e293b",
          color: "#fff",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/payments", { state: { insuranceId: res.data._id, amount: formData.premiumAmount } });
          }
          fetchData();
          setShowApplyModal(false);
        });
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 italic uppercase tracking-tight">Insurance Policies</h1>
          <p className="text-slate-400">View and manage your active protection across all registered vehicles.</p>
        </div>
        <button 
          onClick={() => setShowApplyModal(true)}
          className="btn-primary flex items-center gap-3 px-8"
        >
          <Plus size={20} /> Apply for Insurance
        </button>
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
          {[1,2].map(i => <div key={i} className="glass-card h-64 bg-white/5" />)}
        </div>
      ) : insurances.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-8 pb-10">
          {insurances.map((policy, idx) => (
            <motion.div
              key={policy._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card relative overflow-hidden group border-white/5 hover:border-orange-500/30"
            >
              <div className="absolute top-0 right-0 p-6">
                <StatusBadge status={policy.status} />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-20 h-20 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <ShieldCheck size={40} />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-wide group-hover:text-orange-500 transition-colors">#{policy.policyNumber}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mt-1">
                      <Car size={14} /> {policy.vehicleId?.brand} {policy.vehicleId?.model}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Coverage Utilization</span>
                       <span className="text-[10px] font-black text-white italic">₹{policy.remainingBenefit || policy.premiumAmount} / ₹{policy.totalCoverage || policy.premiumAmount}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/10">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${((policy.remainingBenefit || policy.premiumAmount) / (policy.totalCoverage || policy.premiumAmount)) * 100}%` }}
                         className="h-full bg-gradient-to-r from-orange-500 to-rose-500 shadow-lg shadow-orange-500/20"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Insurance Type</p>
                      <p className="text-sm font-semibold text-slate-200 capitalize">{policy.insuranceType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1 italic text-emerald-500">Premium Paid</p>
                      <p className="text-sm font-semibold text-white">₹{policy.premiumAmount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
                      <Calendar size={14} className="text-orange-500" />
                      Expires {new Date(policy.endDate).toLocaleDateString()}
                    </div>
                    {policy.status === "pending payment" && (
                      <button 
                        onClick={() => navigate("/payments", { state: { insuranceId: policy._id, amount: policy.premiumAmount } })}
                        className="ml-auto text-xs font-black text-orange-500 hover:text-orange-400 flex items-center gap-1 uppercase tracking-wider"
                      >
                        Complete Payment <CreditCard size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center glass-card border-dashed border-white/5">
          <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center text-slate-700 mb-8 border border-white/5">
            <ShieldCheck size={48} />
          </div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-wide mb-3">Protection Shield Not Active</h3>
          <p className="text-slate-400 text-center max-w-sm mb-10">Protect your assets with our best-in-class vehicle insurance coverage. Quick approval guaranteed.</p>
          <button onClick={() => setShowApplyModal(true)} className="btn-primary px-10">Get Covered Now</button>
        </div>
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card w-full max-w-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Apply for Coverage</h2>
                <button onClick={() => setShowApplyModal(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-1">Select Vehicle</label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {vehicles.map(v => (
                      <div 
                        key={v._id}
                        onClick={() => setFormData({...formData, vehicleId: v._id})}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                          formData.vehicleId === v._id 
                            ? "border-orange-500 bg-orange-500/5 shadow-lg shadow-orange-500/20" 
                            : "border-white/5 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.vehicleId === v._id ? "bg-orange-500 text-white" : "bg-white/5 text-slate-500"}`}>
                          <Car size={24} />
                        </div>
                        <div>
                          <p className={`font-bold uppercase italic text-sm ${formData.vehicleId === v._id ? "text-white" : "text-slate-400"}`}>{v.model}</p>
                          <p className="text-[10px] font-medium text-slate-500 tracking-wider">#{v.registrationNumber}</p>
                        </div>
                      </div>
                    ))}
                    {vehicles.length === 0 && (
                      <div className="col-span-2 p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-rose-500 text-center">
                        <p className="text-sm font-bold">No vehicles found. Add a vehicle first.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-1">Coverage Type</label>
                    <div className="space-y-2">
                      {Object.keys(INSURANCE_PLANS).map(type => (
                        <div 
                          key={type}
                          onClick={() => updateType(type)}
                          className={`px-4 py-3 rounded-xl border text-sm font-bold capitalize transition-all cursor-pointer ${
                            formData.insuranceType === type 
                              ? "bg-white text-slate-950 border-white" 
                              : "bg-transparent border-white/10 text-slate-400 hover:border-white/25"
                          }`}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 space-y-4">
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Plan Summary</p>
                      <div className="flex justify-between items-end">
                        <span className="text-slate-400 text-xs">Annual Premium</span>
                        <span className="text-2xl font-black text-white italic">₹{formData.premiumAmount}</span>
                      </div>
                      <div className="space-y-2">
                        {INSURANCE_PLANS[formData.insuranceType].benefits.map((benefit, i) => (
                          <p key={i} className="text-[10px] font-medium text-slate-500 flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-emerald-500" /> {benefit}
                          </p>
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg">
                      Submit Application <ArrowRight size={22} />
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simplified X icon for closure
const X = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

export default Insurance;
