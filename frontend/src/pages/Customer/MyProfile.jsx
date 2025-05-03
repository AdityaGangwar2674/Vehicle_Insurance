// src/pages/Customer/MyProfile.jsx
import { useEffect, useState } from "react";
import { api } from "../../services/api";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/customer/profile");
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-green-600 mb-6">
          My Profile
        </h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <p className="text-lg text-gray-700">Name: {profile.name}</p>
            <p className="text-lg text-gray-700">Email: {profile.email}</p>
            <p className="text-lg text-gray-700">Phone: {profile.phone}</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-6">
              My Vehicles
            </h3>
            <ul>
              {profile.vehicles.map((vehicle) => (
                <li key={vehicle._id} className="text-gray-700">
                  {vehicle.model} - {vehicle.registrationNumber}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
