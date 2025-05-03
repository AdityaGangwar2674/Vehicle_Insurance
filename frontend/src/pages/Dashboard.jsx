// src/pages/Dashboard.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setRole(user.role); // Set role based on authenticated user's data
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Dashboard
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Welcome, {user ? user.name : "Guest"}! You are logged in as {role}.
        </p>

        <div className="flex justify-around">
          {role === "admin" ? (
            <>
              <button
                onClick={() => navigate("/admin/users")}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Manage Users
              </button>
              <button
                onClick={() => navigate("/admin/claims")}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Manage Claims
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/customer/myprofile")}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                My Profile
              </button>
              <button
                onClick={() => navigate("/customer/newvehicle")}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Add Vehicle
              </button>
              <button
                onClick={() => navigate("/customer/buyinsurance")}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Buy Insurance
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
