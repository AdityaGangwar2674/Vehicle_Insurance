import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // Perform logout action
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold">Vehicle Insurance</div>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <>
                  <Link to="/admin/users" className="hover:text-gray-300">
                    Users
                  </Link>
                  <Link to="/admin/claims" className="hover:text-gray-300">
                    Claims
                  </Link>
                </>
              )}
              {user.role === "customer" && (
                <>
                  <Link
                    to="/customer/myprofile"
                    className="hover:text-gray-300"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/customer/newvehicle"
                    className="hover:text-gray-300"
                  >
                    New Vehicle
                  </Link>
                  <Link
                    to="/customer/buyinsurance"
                    className="hover:text-gray-300"
                  >
                    Buy Insurance
                  </Link>
                  <Link
                    to="/customer/fileclaim"
                    className="hover:text-gray-300"
                  >
                    File Claim
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
