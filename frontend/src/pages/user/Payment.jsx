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

const ReceiptModal = ({ receipt, onClose }) => {
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `${receipt.receiptNumber || "Receipt"}_Payment`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm no-print-view"
    >
      <div id="receipt-print-area" className="w-full max-w-sm sm:max-w-md bg-white text-slate-900 overflow-hidden shadow-2xl print:shadow-none print:m-0 print:w-full rounded-3xl print:rounded-none">
        <div className="bg-orange-500 p-8 text-white flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 border border-white/30">
            <ReceiptIcon size={24} />
          </div>
          <h2 className="text-xl font-black italic uppercase tracking-tighter">
            Official Receipt
          </h2>
          <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">
            {receipt.receiptNumber || "TRANSACTION-SUCCESS"}
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
            <span>Date Issued</span>
            <span className="text-slate-600">{new Date(receipt.issuedAt || receipt.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="border-t border-dotted border-slate-200" />

          <div className="space-y-4 px-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Policy ID</span>
              <span className="font-bold text-slate-800 text-sm truncate max-w-[200px]">
                {receipt.paymentId?.insuranceId?.policyNumber || receipt.paymentId?.insuranceId || "POL-LINKED"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Payment Mode</span>
              <span className="font-bold text-slate-800 uppercase italic text-xs tracking-wider">
                {receipt.paymentId?.paymentMode || "Digital Transfer"}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest italic">
                Total Amount Paid
              </span>
              <span className="text-2xl font-black italic text-slate-950">
                ₹{receipt.paymentId?.amountPaid || receipt.paymentId || "0"}
              </span>
            </div>
          </div>

          <div className="pt-10 text-center italic text-[9px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-50 border-inline">
            Thank you for choosing VehicleInsure Protection.
          </div>

          <div className="flex gap-4 pt-4 no-print">
            <button
              onClick={handlePrint}
              className="flex-1 btn-primary py-4 flex items-center justify-center gap-2"
            >
              <Download size={18} /> Generate PDF
            </button>
            <button
              onClick={onClose}
              className="px-6 py-4 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-colors uppercase text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #receipt-print-area, #receipt-print-area * { visibility: visible; }
          #receipt-print-area {
            position: absolute;
            left: 50%;
            top: 40%;
            transform: translate(-50%, -50%);
            width: 14.8cm;
            height: auto;
            border: none !important;
            padding: 0 !important;
          }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0; }
        }
      `}} />
    </motion.div>
  );
};

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

  const handleDownloadFromHistory = async (paymentId) => {
    try {
      Swal.fire({
        title: "Retrieving Receipt",
        text: "Please wait...",
        didOpen: () => Swal.showLoading(),
        background: "#1e293b",
        color: "#fff",
      });
      const res = await api.get("/receipts/me");
      if (res.success) {
        const receipt = res.data.find(r => r.paymentId._id === paymentId || r.paymentId === paymentId);
        if (receipt) {
          setActiveReceipt(receipt);
          Swal.close();
        } else {
          Swal.fire("Not Found", "Receipt not generated for this transaction", "info");
        }
      }
    } catch (err) {
      Swal.fire("Error", "Could not fetch receipt", "error");
    }
  };

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
                      <th className="px-8 py-6">Action</th>
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
                        <td className="px-8 py-6">
                           <button 
                             onClick={() => handleDownloadFromHistory(p._id)}
                             className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-white/10 transition-all group-hover:scale-110"
                             title="Download Receipt"
                           >
                             <Download size={16} />
                           </button>
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
