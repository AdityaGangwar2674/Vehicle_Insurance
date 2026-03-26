import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { 
  AlertTriangle, 
  Plus, 
  X, 
  Upload, 
  ArrowRight,
  ShieldCheck,
  BadgeAlert,
  Trash2,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const ClaimStatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };
  return (
    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
};

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    insuranceId: "",
    claimReason: "",
    claimAmount: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, iRes] = await Promise.all([
        api.get("/claim/me"),
        api.get("/insurance/me")
      ]);
      if (cRes.success) setClaims(cRes.data);
      if (iRes.success) setInsurances(iRes.data.filter(i => i.status === 'active'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileClaim = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("insuranceId", formData.insuranceId);
    data.append("claimReason", formData.claimReason);
    data.append("claimAmount", formData.claimAmount);
    if (image) data.append("accidentImage", image);

    try {
      const res = await api.post("/claim", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.success) {
        Swal.fire("Claim Filed", "Our team will review your claim within 24 hours.", "success");
        fetchData();
        setShowModal(false);
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 italic uppercase tracking-tighter">Incident Reports</h1>
          <p className="text-slate-400">Track and manage your insurance claims with real-time updates.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-3 px-10 py-4 bg-rose-500 shadow-rose-500/25 border-none hover:bg-rose-600"
        >
          <Plus size={22} /> File a Claim
        </button>
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
          {[1,2].map(i => <div key={i} className="glass-card h-64 bg-white/5" />)}
        </div>
      ) : claims.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-8 pb-10">
          {claims.map((claim, idx) => (
            <motion.div
              key={claim._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card relative overflow-hidden group border-white/5 hover:border-rose-500/30"
            >
              <div className="absolute top-0 right-0 p-6">
                <ClaimStatusBadge status={claim.claimStatus} />
              </div>

              <div className="flex flex-col sm:flex-row gap-8">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 ring-4 ring-white/5 bg-slate-800">
                  {claim.accidentImage ? (
                    <img src={claim.accidentImage} alt="Accident" className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <BadgeAlert size={40} />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-wide group-hover:text-rose-500 transition-colors">Claim Request</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mt-1">
                      <ShieldCheck size={14} className="text-rose-500" /> Policy: {claim.insuranceId?.policyNumber || 'INS-POL-ID'}
                    </p>
                  </div>

                  <p className="text-sm font-medium text-slate-300 leading-relaxed max-w-sm">{claim.claimReason}</p>

                  <div className="flex items-center gap-6 pt-4 border-t border-white/5 uppercase">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 tracking-widest text-xs">Claim Amount</span>
                      <span className="text-lg font-black text-white italic">₹{claim.claimAmount}</span>
                    </div>
                    <div className="flex flex-col ml-auto">
                      <span className="text-[10px] font-black text-slate-500 tracking-widest text-xs">Submission Date</span>
                      <span className="text-sm font-bold text-slate-300 italic">{new Date(claim.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center glass-card border-dashed border-white/5">
          <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center text-slate-800 mb-8 border border-white/5 group hover:rotate-12 transition-transform">
            <BadgeAlert size={48} className="text-slate-700 group-hover:text-rose-500 transition-colors" />
          </div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-wide mb-3">No Claims Filed</h3>
          <p className="text-slate-400 text-center max-w-sm mb-10 italic">Your journey has been safe so far. If you ever have an incident, we're here to help in minutes.</p>
          <button onClick={() => setShowModal(true)} className="btn-secondary px-10 bg-slate-900 border-slate-800 py-3 uppercase tracking-widest text-xs font-black">Register Incident</button>
        </div>
      )}

      {/* Claim Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card w-full max-w-2xl bg-slate-950 border-white/10"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 uppercase italic">
                <h2 className="text-2xl font-black text-white tracking-tighter">New Claim Registration</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleFileClaim} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-1 italic">Active Shield Selection</label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {insurances.map(i => (
                      <div 
                        key={i._id}
                        onClick={() => setFormData({...formData, insuranceId: i._id})}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                          formData.insuranceId === i._id 
                            ? "border-rose-500 bg-rose-500/5 shadow-lg shadow-rose-500/20" 
                            : "border-white/5 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <ShieldCheck size={28} className={formData.insuranceId === i._id ? "text-rose-500" : "text-slate-600"} />
                        <div>
                          <p className={`font-black uppercase italic text-sm ${formData.insuranceId === i._id ? "text-white" : "text-slate-400"}`}>{i.policyNumber}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{i.vehicleId?.brand} {i.vehicleId?.model}</p>
                        </div>
                      </div>
                    ))}
                    {insurances.length === 0 && (
                      <div className="col-span-2 p-10 rounded-2xl bg-orange-500/5 border border-orange-500/20 text-center space-y-3">
                        <AlertTriangle className="mx-auto text-orange-500" size={32} />
                        <p className="text-sm font-black italic text-slate-300 uppercase tracking-wide">No Active Policies Found</p>
                        <p className="text-xs text-slate-500">You must have an active, paid-up insurance policy to file a claim.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Estimate (₹)</label>
                       <input 
                        type="number" 
                        placeholder="Expected refund amount"
                        className="input-field w-full outline-none"
                        required
                        value={formData.claimAmount}
                        onChange={(e) => setFormData({...formData, claimAmount: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1 italic">Accident Evidence (Optional)</label>
                       <div className="relative group h-40 rounded-2xl border-2 border-dashed border-white/5 bg-white/5 hover:border-rose-500 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden p-2">
                          {preview ? (
                            <>
                              <img src={preview} alt="Evidence" className="w-full h-full object-cover rounded-xl" />
                              <button 
                                type="button"
                                onClick={() => {setImage(null); setPreview(null);}}
                                className="absolute top-4 right-4 p-2 bg-black/60 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <Upload size={32} className="text-slate-700 group-hover:text-rose-500 mb-4 transition-colors" />
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upload Photo Evidence</p>
                              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                const file = e.target.files[0];
                                if(file) {setImage(file); setPreview(URL.createObjectURL(file))}
                              }} accept="image/*" />
                            </>
                          )}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Describe Incident</label>
                    <textarea 
                      placeholder="Tell us what happened in detail..."
                      className="input-field w-full h-[12.5rem] resize-none overflow-y-auto custom-scrollbar"
                      required
                      value={formData.claimReason}
                      onChange={(e) => setFormData({...formData, claimReason: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-4 uppercase text-xs font-black tracking-widest italic">Abort</button>
                  <button type="submit" disabled={submitting || !formData.insuranceId} className="btn-primary bg-rose-500 flex-1 py-4 flex items-center justify-center gap-3 shadow-rose-500/25 italic uppercase font-black text-xs tracking-widest">
                    {submitting ? <Loader2 size={24} className="animate-spin" /> : <>Finalize Filing <ArrowRight size={22} /></>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Claims;
