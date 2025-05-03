// src/pages/Customer/BuyInsurance.jsx
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const BuyInsurance = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get("/customer/vehicles");
        setVehicles(response.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };
    fetchVehicles();
  }, []);

  const handleBuyInsurance = async () => {
    setLoading(true);
    try {
      await api.post(`/insurance/buy/${selectedVehicle}`);
      setLoading(false);
      navigate("/customer/myprofile");
    } catch (err) {
      console.error("Error buying insurance:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-green-600 mb-6">
          Buy Insurance
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600">
            Select Vehicle
          </label>
          <select
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            required
          >
            <option value="">Select a vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.model} - {vehicle.registrationNumber}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleBuyInsurance}
          className={`w-full py-3 bg-green-600 text-white rounded-lg ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || !selectedVehicle}
        >
          {loading ? "Buying Insurance..." : "Buy Insurance"}
        </button>
      </div>
    </div>
  );
};

export default BuyInsurance;
