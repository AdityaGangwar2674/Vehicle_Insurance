import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/user/Dashboard";
import Claims from "./pages/user/Claims";
import Insurance from "./pages/user/Insurance";
import Payment from "./pages/user/Payment";
import Vehicles from "./pages/user/Vehicles";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Customers from "./pages/admin/Customers";
import CustomerClaims from "./pages/admin/CustomerClaims";
import CustomerPayments from "./pages/admin/CustomerPayments";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* main page */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* dashboard page */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/claims" element={<Claims />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/payments" element={<Payment />} />
          <Route path="/vehicles" element={<Vehicles />} />

          {/* admin dashboard */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/claims" element={<CustomerClaims />} />
          <Route path="/admin/payments" element={<CustomerPayments />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
