import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { 
  Car, 
  Plus, 
  X, 
  Upload, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Hash,
  Loader2,
  Trash2,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const VehicleCard = ({ vehicle, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card flex flex-col group overflow-hidden"
  >
    <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
      {vehicle.image ? (
        <img 
          src={vehicle.image} 
          alt={vehicle.model} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-700">
          <Car size={48} />
        </div>
      )}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-bold text-orange-400">
        <CheckCircle2 size={12} /> Registered
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors uppercase italic tracking-wide">{vehicle.brand} {vehicle.model}</h3>
        <p className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2"><Hash size={12} /> {vehicle.registrationNumber}</p>
      </div>

      <div className="flex items-center gap-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Calendar size={16} className="text-orange-500" />
          <span>{vehicle.manufactureYear}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Car size={16} className="text-orange-500" />
          <span className="capitalize">{vehicle.type}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const AddVehicleModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    brand: "",
    model: "",
    type: "car",
    manufactureYear: new Date().getFullYear(),
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("registrationNumber", formData.registrationNumber);
    data.append("brand", formData.brand);
    data.append("model", formData.model);
    data.append("type", formData.type);
    data.append("manufactureYear", formData.manufactureYear);
    if (image) data.append("image", image);

    try {
      const res = await api.post("/vehicles/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.success) {
        Swal.fire("Success!", "Vehicle added successfully", "success");
        onSuccess();
        onClose();
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to add vehicle", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl shadow-black/50"
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <h2 className="text-2xl font-black text-white italic uppercase flex items-center gap-3">
            <Plus size={24} className="text-orange-500" /> Add New Vehicle
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Reg Number (Unique)</label>
              <input 
                type="text" 
                placeholder="MH 12 AB 1234"
                className="input-field w-full"
                required
                value={formData.registrationNumber}
                onChange={(e) => setFormData({...formData, registrationNumber: e.target.value.toUpperCase()})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Brand</label>
              <input 
                type="text" 
                placeholder="e.g. Tesla"
                className="input-field w-full"
                required
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Model</label>
              <input 
                type="text" 
                placeholder="e.g. Model S"
                className="input-field w-full"
                required
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Manufacture Year</label>
              <input 
                type="number" 
                min="1990" 
                max={new Date().getFullYear()}
                className="input-field w-full"
                required
                value={formData.manufactureYear}
                onChange={(e) => setFormData({...formData, manufactureYear: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Vehicle Type</label>
            <select 
              className="input-field w-full cursor-pointer appearance-none"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="truck">Truck</option>
              <option value="bus">Bus</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Vehicle Image</label>
            <div className="relative group/upload h-40 rounded-2xl border-2 border-dashed border-white/5 bg-white/5 hover:border-orange-500/50 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden p-2">
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  <button 
                    type="button"
                    onClick={() => {setImage(null); setPreview(null);}}
                    className="absolute top-4 right-4 p-2 bg-black/60 rounded-xl text-white opacity-0 group-hover/upload:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Upload size={32} className="text-slate-500 group-hover/upload:text-orange-500 mb-4 transition-colors" />
                  <p className="text-sm font-medium text-slate-400">Click to upload vehicle photo</p>
                  <p className="text-[10px] text-slate-600 mt-2">JPG, PNG up to 10MB</p>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-4">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-4 flex items-center justify-center gap-3">
              {loading ? <Loader2 size={24} className="animate-spin" /> : <>Save Vehicle <ArrowRight size={20} /></>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/vehicles/me");
      if (res.success) setVehicles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v => 
    v.brand.toLowerCase().includes(search.toLowerCase()) || 
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.registrationNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Vehicles</h1>
          <p className="text-slate-400">Manage your automotive portfolio securely.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-3 px-8"
        >
          <Plus size={20} /> Add New Vehicle
        </button>
      </div>

      {/* Control Bar */}
      <div className="glass h-16 rounded-2xl flex items-center px-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by brand, model or plate..." 
            className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-2 pl-12 pr-4 text-sm focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="glass-card h-80 animate-pulse bg-white/5" />)}
        </div>
      ) : filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
          {filteredVehicles.map((vehicle, index) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} delay={index * 0.1} />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 glass-card border-dashed border-white/5"
        >
          <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-700 mb-6">
            <Car size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Vehicles Found</h3>
          <p className="text-slate-500 mb-8">Ready to secure your first journey?</p>
          <button onClick={() => setShowModal(true)} className="btn-secondary py-2">Add My First Vehicle</button>
        </motion.div>
      )}

      {/* Modal Integration */}
      <AnimatePresence>
        {showModal && (
          <AddVehicleModal 
            onClose={() => setShowModal(false)} 
            onSuccess={fetchVehicles} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vehicles;
