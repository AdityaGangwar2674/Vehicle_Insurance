// src/pages/Customer/FileClaim.jsx
import { useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const FileClaim = () => {
  const [claimDetails, setClaimDetails] = useState({
    claimDescription: "",
    vehicleId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClaimDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/claims/new", claimDetails);
      setLoading(false);
      navigate("/customer/myprofile"); // Redirect after successful claim
    } catch (err) {
      console.error("Error filing claim:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-green-600 mb-6">
          File a Claim
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Claim Description
            </label>
            <textarea
              name="claimDescription"
              value={claimDetails.claimDescription}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Vehicle ID
            </label>
            <input
              type="text"
              name="vehicleId"
              value={claimDetails.vehicleId}
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
            {loading ? "Filing Claim..." : "File Claim"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileClaim;
