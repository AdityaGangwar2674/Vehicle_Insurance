import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { 
  Search, 
  Calendar, 
  ArrowDownCircle,
  TrendingUp,
  Receipt as ReceiptIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const CustomerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payment");
      if (res.success) setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalRevenue = payments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);

  const filteredPayments = payments.filter(p => 
    p.transactionId.toLowerCase().includes(search.toLowerCase()) || 
    p.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.insuranceId?.policyNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Global Financial Ledger</h1>
          <p className="text-slate-400 font-medium tracking-tight">System-wide transaction monitoring and revenue auditing engine.</p>
        </div>
        <div className="glass h-20 rounded-3xl p-6 border-emerald-500/20 bg-emerald-500/5 flex items-center gap-6">
           <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 grow-0 shrink-0">
             <TrendingUp size={24} />
           </div>
           <div>
             <span className="text-[10px] font-black uppercase tracking-widest leading-none text-slate-500 italic">Total System Gross</span>
             <h3 className="text-2xl font-black text-white italic tracking-tighter leading-none mt-1 uppercase">₹ {totalRevenue.toLocaleString()}</h3>
           </div>
        </div>
      </div>

      <div className="glass h-16 rounded-2xl flex items-center px-6">
        <div className="relative flex-1 max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by TxID, Policy or Customer Identity..." 
            className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-2 pl-12 pr-4 text-sm focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="glass-card h-96 animate-pulse bg-white/5" />
      ) : filteredPayments.length > 0 ? (
        <div className="glass overflow-hidden rounded-3xl border-white/5 shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-8 py-6">Transaction ID</th>
                  <th className="px-8 py-6">Customer / Policy</th>
                  <th className="px-8 py-6">Quantum Paid</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right">Activity Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayments.map((p, i) => (
                  <motion.tr 
                    key={p._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500">
                              <ArrowDownCircle size={20} className="text-emerald-500/50 group-hover:text-emerald-500 group-hover:rotate-12 transition-all" />
                           </div>
                           <div>
                              <p className="text-white font-black text-sm tracking-wide uppercase italic">#{p.transactionId}</p>
                              <p className="text-[10px] uppercase text-slate-500 font-black flex items-center gap-1 mt-1 opacity-50">{p.paymentMode}</p>
                           </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-100 flex items-center gap-2">
                             {p.customerId?.name || 'Unknown Operator'}
                          </p>
                          <p className="text-[10px] uppercase text-emerald-500 font-bold italic truncate max-w-[150px]">
                            {p.insuranceId?.policyNumber || 'INS-POL-REF'}
                          </p>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <p className="text-xl font-black text-white italic tracking-tighter">₹ {p.amountPaid}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                        <span className="px-4 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">AUTHORIZED</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 text-slate-500">
                           <Calendar size={14} className="text-slate-700" />
                           <span className="text-[10px] font-black uppercase tracking-widest">{new Date(p.paymentDate).toLocaleDateString()}</span>
                        </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center glass-card border-dashed border-white/5 opacity-50">
           <ReceiptIcon size={48} className="text-slate-700 mb-6" />
           <p className="text-slate-500 font-black italic uppercase text-xs tracking-[0.3em]">No Financial History Discovered.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerPayments;
