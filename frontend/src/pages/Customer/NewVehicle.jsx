// src/pages/Customer/NewVehicle.jsx
import { useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const NewVehicle = () => {
  const [vehicle, setVehicle] = useState({
    model: "",
    registrationNumber: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/vehicle/new", vehicle);
      setLoading(false);
      navigate("/customer/myprofile"); // Redirect to My Profile page
    } catch (err) {
      console.error("Error adding vehicle:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-green-600 mb-6">
          Add New Vehicle
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Vehicle Model
            </label>
            <input
              type="text"
              name="model"
              value={vehicle.model}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Registration Number
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={vehicle.registrationNumber}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Year of Manufacture
            </label>
            <input
              type="number"
              name="year"
              value={vehicle.year}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 bg-green-600 text-white rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding Vehicle..." : "Add Vehicle"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewVehicle;
