import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { 
  Users, 
  Search, 
  Mail,  
  ShieldCheck, 
  Car, 
  Clock,
  ExternalLink,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/users");
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u._id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Customer Repository</h1>
        <p className="text-slate-400 font-medium">Global directory of verified system users and protection holders.</p>
      </div>

      <div className="glass h-16 rounded-2xl flex items-center px-6">
        <div className="relative flex-1 max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by identity, email or unique ID..." 
            className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-2 pl-12 pr-4 text-sm focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="glass-card h-96 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="glass overflow-hidden rounded-3xl border-white/5 shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-8 py-6">Customer Identity</th>
                  <th className="px-8 py-6">Digital Contact</th>
                  <th className="px-8 py-6 text-center">Coverage Portfolio</th>
                  <th className="px-8 py-6 text-center">Access Role</th>
                  <th className="px-8 py-6 text-right">System Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u, i) => (
                  <motion.tr 
                    key={u._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-500/20">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm tracking-wide uppercase italic">{u.name}</p>
                          <p className="text-[10px] uppercase text-slate-500 font-black flex items-center gap-1 mt-1 transition-opacity opacity-50 group-hover:opacity-100">
                            ID: {u._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                           <Mail size={12} className="text-indigo-500" /> {u.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase italic">
                           <Clock size={12} className="text-slate-700" /> Joined {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center">
                           <Car size={16} className="text-orange-500 mb-1" />
                           <span className="text-xs font-black text-white italic">0</span>
                        </div>
                        <div className="flex flex-col items-center">
                           <ShieldCheck size={16} className="text-emerald-500 mb-1" />
                           <span className="text-xs font-black text-white italic">0</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        u.role === 'admin' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 group-hover:text-white transition-all shadow-lg shadow-black/20">
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center glass-card border-dashed border-white/5 opacity-50">
          <Users size={48} className="text-slate-700 mb-6" />
          <p className="text-slate-500 italic uppercase font-black text-xs tracking-widest">Global cache empty or no matches found.</p>
        </div>
      )}
    </div>
  );
};

export default Customers;
