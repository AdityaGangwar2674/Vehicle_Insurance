// src/pages/Admin/Users.jsx
import { useEffect, useState } from "react";
import { api } from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Users Management
        </h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900">
                  Email
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900">
                  Role
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    {user.role}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    <button className="text-red-500 hover:text-red-700">
                      Delete
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

export default Users;
