import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Receipt as ReceiptIcon,
  Download,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ReceiptModal = ({ receipt, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
  >
    <div className="glass-card w-full max-w-md bg-white text-slate-900 border-none relative overflow-hidden p-0 shadow-2xl">
      <div className="bg-orange-500 p-8 text-white flex flex-col items-center">
        <ReceiptIcon size={48} className="mb-4" />
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">
          Official Receipt
        </h2>
        <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-2">
          {receipt.receiptNumber || "TRANSACTION-SUCCESS"}
        </p>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center text-sm font-bold uppercase text-slate-400">
          <span>Date Issued</span>
          <span>{new Date(receipt.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="pt-6 border-t border-dashed border-slate-200 space-y-4">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Policy ID</span>
            <span className="font-bold text-slate-800">
              {receipt.paymentId?.insuranceId || "POL-SEC-0012"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Payment Mode</span>
            <span className="font-bold text-slate-800 uppercase italic">
              Digital Bank Transfer
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-600 font-bold uppercase text-xs tracking-widest">
              Total Amount Paid
            </span>
            <span className="text-2xl font-black text-slate-950 italic">
              ₹{receipt.paymentId?.amountPaid || "12000"}
            </span>
          </div>
        </div>

        <div className="pt-6 text-center italic text-[10px] text-slate-400 font-bold uppercase">
          Thank you for choosing VehicleInsure Protection.
        </div>

        <div className="flex gap-4 pt-6">
          <button
            onClick={() => window.print()}
            className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
          >
            <Download size={18} /> Download PDF
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors uppercase text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("history"); // history | new
  const [payFormData, setPayFormData] = useState({
    insuranceId: location.state?.insuranceId || "",
    amount: location.state?.amount || "",
    paymentMode: "card",
  });
  const [activeReceipt, setActiveReceipt] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payment/me");
      if (res.success) setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    if (location.state?.insuranceId) setActiveTab("new");
  }, [location.state]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!payFormData.insuranceId)
      return Swal.fire(
        "Required",
        "No insurance policy selected for payment",
        "warning",
      );

    try {
      Swal.fire({
        title: "Authorizing Transaction",
        text: "Syncing with secure gateway...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        background: "#1e293b",
        color: "#fff",
      });

      const res = await api.post("/payment", {
        insuranceId: payFormData.insuranceId,
        amountPaid: payFormData.amount,
        paymentMode: payFormData.paymentMode,
      });

      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text: "Insurance is now ACTIVE. Receipt generated.",
          background: "#1e293b",
          color: "#fff",
        });

        // Fetch receipt for display
        const rRes = await api.get("/receipts/me");
        if (rRes.success) setActiveReceipt(rRes.data[rRes.data.length - 1]);

        fetchPayments();
        setActiveTab("history");
        setPayFormData({ insuranceId: "", amount: "", paymentMode: "card" });
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 italic uppercase tracking-tighter">
            Finance & Receipts
          </h1>
          <p className="text-slate-400">
            Manage your premium payments and download official documents.
          </p>
        </div>
        <div className="flex p-1.5 glass rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-xl text-sm font-black uppercase transition-all ${activeTab === "history" ? "bg-white text-slate-950 shadow-lg" : "text-slate-500 hover:text-white"}`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`px-6 py-2 rounded-xl text-sm font-black uppercase transition-all ${activeTab === "new" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-slate-500 hover:text-white"}`}
          >
            New Payment
          </button>
        </div>
      </div>

      {activeTab === "history" && (
        <div className="space-y-6">
          {loading ? (
            <div className="glass-card h-64 animate-pulse bg-white/5" />
          ) : payments.length > 0 ? (
            <div className="glass overflow-hidden rounded-3xl border-white/5">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <th className="px-8 py-6">Transaction ID</th>
                      <th className="px-8 py-6">Insurance Policy</th>
                      <th className="px-8 py-6">Amount Paid</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6">Payment Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {payments.map((p, i) => (
                      <tr
                        key={p._id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <p className="text-white font-bold text-sm tracking-wide">
                            #{p.transactionId}
                          </p>
                          <p className="text-[10px] uppercase text-slate-500 font-black">
                            {p.paymentMode}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-semibold text-slate-300 uppercase italic">
                            {typeof p.insuranceId === "object"
                              ? p.insuranceId.policyNumber
                              : "POL-LINKED"}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-lg font-black text-orange-500 italic">
                            ₹{p.amountPaid}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                            COMPLETED
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                            <Calendar size={14} className="text-orange-500" />
                            {new Date(p.paymentDate).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-32 glass-card">
              <CreditCard size={48} className="mx-auto text-slate-700 mb-6" />
              <p className="text-slate-400 italic">
                Financial ledger is empty.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "new" && (
        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card shadow-2xl shadow-orange-500/10"
          >
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-white">
              Payment Portal
            </h2>
            <form onSubmit={handlePay} className="space-y-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-1">
                  Amount to Pay
                </label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500 font-black text-2xl">
                    ₹
                  </div>
                  <input
                    readOnly
                    value={payFormData.amount}
                    className="input-field w-full pl-12 h-20 text-3xl font-black italic text-white"
                  />
                </div>
                {!payFormData.insuranceId && (
                  <p className="text-xs text-rose-500 mt-2 flex items-center gap-2 italic">
                    <AlertCircle size={14} /> Navigate from Insurance module to
                    select a policy for payment.
                  </p>
                )}
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-1">
                  Secure Payment Methods
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {["card", "upi", "wallet", "netbanking"].map((mode) => (
                    <div
                      key={mode}
                      onClick={() =>
                        setPayFormData({ ...payFormData, paymentMode: mode })
                      }
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${payFormData.paymentMode === mode ? "border-orange-500 bg-orange-500/5 shadow-lg shadow-orange-500/20" : "border-white/5 bg-white/5 hover:border-white/10"}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${payFormData.paymentMode === mode ? "bg-orange-500 text-white" : "bg-white/5 text-slate-500"}`}
                      >
                        {mode === "card" && <CreditCard size={18} />}
                        {mode !== "card" && <ShieldCheck size={18} />}
                      </div>
                      <span
                        className={`font-bold italic uppercase text-xs tracking-widest ${payFormData.paymentMode === mode ? "text-white" : "text-slate-500"}`}
                      >
                        {mode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled={!payFormData.insuranceId}
                type="submit"
                className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-xl"
              >
                Authorize Transaction <ArrowRight size={24} />
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass-card bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-lg font-black italic uppercase tracking-tight text-white">
                  Trust & Security
                </h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your data is encrypted using military-grade AES-256. We never
                store your full card details once the transaction is completed.
              </p>
            </div>

            <div className="glass-card bg-orange-500/5 border-orange-500/20">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4 italic">
                Next Steps
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                  <CheckCircle2 size={16} className="text-orange-500" /> Instant
                  Activation
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                  <CheckCircle2 size={16} className="text-orange-500" /> Digital
                  Receipt Shared
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                  <CheckCircle2 size={16} className="text-orange-500" />{" "}
                  Eligibility for Claims
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      )}

      {/* Persistent Receipt View */}
      {activeReceipt && (
        <ReceiptModal
          receipt={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}
    </div>
  );
};

export default Payment;
