import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  User, 
  Car, 
  Calendar,
  X,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const INSURANCE_PLANS = {
  comprehensive: { premium: 12500 },
  "third-party": { premium: 4200 },
  "own damage": { premium: 8800 },
  "personal_accident": { premium: 2100 }
};

const AdminInsurances = () => {
  const [insurances, setInsurances] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const [formData, setFormData] = useState({
    customerId: "",
    vehicleId: "",
    insuranceType: "comprehensive",
    insuranceProvider: "SecureInsure Global",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    premiumAmount: 12500,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [iRes, cRes, vRes] = await Promise.all([
        api.get("/insurance"),
        api.get("/auth/users"), // Assuming this gets all customers
        api.get("/vehicles")
      ]);
      setInsurances(iRes.data || []);
      setCustomers(cRes.data || []);
      setVehicles(vRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const policyNumber = "POL-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      const res = await api.post("/insurance", { ...formData, policyNumber });
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Policy Issued",
          text: `Policy ${policyNumber} has been created successfully.`,
          background: "#1e293b",
          color: "#fff",
        });
        setShowAddModal(false);
        fetchData();
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Policy?",
      text: "This will terminate the coverage immediately.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      confirmButtonText: "Yes, Cancel It",
      background: "#1e293b",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/insurance/${id}`, { status: "cancelled" });
        Swal.fire("Cancelled", "Policy has been terminated.", "success");
        fetchData();
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  const filteredInsurances = filter === "all" ? insurances : insurances.filter(i => i.status === filter);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Global Policy Engine</h1>
          <p className="text-slate-400 font-medium">Monitoring {insurances.length} active risk protection contracts.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-3 px-8 h-14"
        >
          <Plus size={22} /> Issue New Policy
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {["all", "active", "pending payment", "expired", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              filter === f 
                ? "bg-white text-slate-950 border-white" 
                : "border-white/5 text-slate-500 hover:border-white/20"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="glass-card h-40 bg-white/5" />)}
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInsurances.map((policy) => (
            <div key={policy._id} className="glass-card flex flex-col gap-6 relative group border-white/5 hover:border-orange-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <ShieldCheck size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${
                  policy.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                  policy.status === 'pending payment' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                  'bg-rose-500/10 text-rose-500 border-rose-500/20'
                }`}>
                  {policy.status}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white italic tracking-tight">{policy.policyNumber}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <User size={12} className="text-orange-500" /> {policy.customerId?.name || 'Unknown Client'}
                </p>
                <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest">
                   {policy.vehicleId?.brand} {policy.vehicleId?.model} • {policy.vehicleId?.registrationNumber}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Premium</p>
                  <p className="text-sm font-black text-orange-500 italic">₹{policy.premiumAmount}</p>
                </div>
                {policy.status !== 'cancelled' && (
                  <button 
                    onClick={() => handleCancel(policy._id)}
                    className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-400 transition-colors"
                  >
                    Terminate
                  </button>
                )}
              </div>
            </div>
          ))}
          {filteredInsurances.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card border-dashed border-white/5">
              <p className="text-slate-500 font-bold uppercase italic tracking-widest">No matching insurance records found</p>
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <h2 className="text-2xl font-black italic uppercase text-white">Issue Manual Policy</h2>
                <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-8">
                <div className="grid gap-6">
                  {/* Customer Select */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-1">Customer</label>
                    <select 
                      value={formData.customerId}
                      onChange={(e) => setFormData({...formData, customerId: e.target.value, vehicleId: ""})}
                      className="input-field w-full"
                      required
                    >
                      <option value="">Select Target Customer</option>
                      {customers.map(c => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
                    </select>
                  </div>

                  {/* Vehicle Select (Filtered by Customer) */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-1">Vehicle Asset</label>
                    <select 
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                      className="input-field w-full"
                      disabled={!formData.customerId}
                      required
                    >
                      <option value="">Select Customer Vehicle</option>
                      {/* Note: backend returns vehicles with customerId populated. 
                          However, our auth/users doesn't have vehicles.
                          I'll filter the vehicles list by customerId.
                      */}
                      {vehicles.filter(v => v.customerId?._id === formData.customerId || v.customerId === formData.customerId).map(v => (
                        <option key={v._id} value={v._id}>{v.brand} {v.model} - {v.registrationNumber}</option>
                      ))}
                    </select>
                  </div>

                  {/* Plan Select */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-1">Coverage Tier</label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(INSURANCE_PLANS).map(type => (
                        <div 
                          key={type}
                          onClick={() => setFormData({...formData, insuranceType: type, premiumAmount: INSURANCE_PLANS[type].premium})}
                          className={`p-4 rounded-xl border text-xs font-black uppercase tracking-widest cursor-pointer transition-all ${
                            formData.insuranceType === type 
                              ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20" 
                              : "border-white/5 bg-white/5 text-slate-500 hover:border-white/20"
                          }`}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 backdrop-blur-sm">
                  <div className="flex justify-between items-center font-black italic">
                    <span className="text-slate-500 text-[10px] uppercase tracking-widest">Automatic Premium Calculation</span>
                    <span className="text-white text-xl">₹{formData.premiumAmount}</span>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg">
                  Finalize Issuance <ArrowRight size={22} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminInsurances;
