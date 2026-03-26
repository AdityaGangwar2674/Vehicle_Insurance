import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  BadgeAlert,
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const CustomerClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await api.get("/claim");
      if (res.success) setClaims(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      Swal.fire({
        title: "Syncing Decision",
        text: "Updating centralized ledger...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        background: "#1e293b",
        color: "#fff",
      });

      const res = await api.put(`/claim/${id}`, { claimStatus: status });
      if (res.success) {
        Swal.fire(
          "System Updated",
          `Claim has been ${status} successfully.`,
          "success",
        );
        fetchClaims();
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
            Incident Validation Queue
          </h1>
          <p className="text-slate-400 font-medium tracking-tight">
            System-wide claim registry for administrative review and status
            finalization.
          </p>
        </div>
        <div className="px-6 py-3 rounded-2xl glass border border-white/5 bg-rose-500/5 text-rose-500 flex items-center gap-4">
          <AlertTriangle size={24} className="animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
              High Priority
            </span>
            <span className="text-xl font-bold tracking-tighter">
              {claims.filter((c) => c.claimStatus === "pending").length} Actions
              Required
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card h-80 bg-white/5" />
          ))}
        </div>
      ) : claims.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-8 pb-10">
          {claims.map((claim, idx) => (
            <motion.div
              key={claim._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card relative overflow-hidden group border-white/5 ${
                claim.claimStatus === "pending"
                  ? "hover:border-rose-500/30"
                  : "hover:border-indigo-500/30"
              }`}
            >
              <div className="absolute top-0 right-0 p-6 flex items-center gap-4">
                <span
                  className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    claim.claimStatus === "pending"
                      ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      : claim.claimStatus === "approved"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  }`}
                >
                  {claim.claimStatus}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-8">
                <div className="w-24 h-32 rounded-3xl overflow-hidden shrink-0 ring-4 ring-white/5 bg-slate-800 self-center sm:self-start">
                  {claim.accidentImage ? (
                    <img
                      src={claim.accidentImage}
                      alt="Accident"
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <BadgeAlert size={40} />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-indigo-500 italic uppercase tracking-wider group-hover:text-rose-500 transition-colors">
                      Incident Request
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5 border border-white/5 px-3 py-1 bg-white/5 rounded-full">
                        <ShieldCheck size={12} className="text-indigo-500" />{" "}
                        Policy{" "}
                        {claim.insuranceId?.policyNumber || "INS-POL-REF"}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5 border border-white/5 px-3 py-1 bg-white/5 rounded-full">
                        <Calendar size={12} className="text-orange-500" /> Filed{" "}
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-3">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1 italic">
                      Claimant Justification
                    </p>
                    <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
                      "{claim.claimReason}"
                    </p>
                  </div>

                  <div className="flex items-center gap-8 pt-6 border-t border-white/5 uppercase">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 tracking-widest italic leading-none mb-2">
                        Claim Value
                      </span>
                      <span className="text-2xl font-black text-white italic">
                        ₹{claim.claimAmount}
                      </span>
                    </div>

                    {claim.claimStatus === "pending" && (
                      <div className="flex-1 flex gap-3 ml-auto">
                        <button
                          onClick={() =>
                            handleUpdateStatus(claim._id, "approved")
                          }
                          className="flex-1 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-emerald-500/5 group/btn"
                        >
                          Approve{" "}
                          <CheckCircle2
                            size={14}
                            className="inline ml-2 group-hover/btn:rotate-12"
                          />
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(claim._id, "rejected")
                          }
                          className="flex-1 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/5 group/btn"
                        >
                          Reject{" "}
                          <XCircle
                            size={14}
                            className="inline ml-2 group-hover/btn:rotate-12"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center glass-card border-dashed border-white/5 opacity-50">
          <div className="p-8 rounded-full bg-slate-800/20 text-slate-700 mb-6 border border-white/5">
            <CheckCircle2 size={48} />
          </div>
          <p className="text-slate-500 font-black italic uppercase text-xs tracking-[0.3em]">
            Approval Queue is Optimized.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerClaims;
