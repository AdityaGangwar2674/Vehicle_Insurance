// src/pages/Admin/Claims.jsx
import { useEffect, useState } from "react";
import { api } from "../../services/api";

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get("/claims");
        setClaims(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching claims:", err);
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const updateStatus = async (claimId, newStatus) => {
    try {
      await api.put(`/claims/${claimId}/status`, { status: newStatus });
      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim._id === claimId ? { ...claim, status: newStatus } : claim
        )
      );
    } catch (err) {
      console.error("Error updating claim status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Claims Management
        </h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900">
                  Claim ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900">
                  Customer
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim._id}>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    {claim._id}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    {claim.customerName}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    {claim.status}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    <button
                      onClick={() => updateStatus(claim._id, "Approved")}
                      className="text-green-500 hover:text-green-700 mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(claim._id, "Rejected")}
                      className="text-red-500 hover:text-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Claims;
