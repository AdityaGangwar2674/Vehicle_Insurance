import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import AdminInsurances from "./pages/admin/AdminInsurances";
import CustomerClaims from "./pages/admin/CustomerClaims";
import CustomerPayments from "./pages/admin/CustomerPayments";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

const ProtectedPage = ({ children, adminOnly = false }) => (
  <PrivateRoute adminOnly={adminOnly}>
    <Layout>{children}</Layout>
  </PrivateRoute>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
          <Route path="/vehicles" element={<ProtectedPage><Vehicles /></ProtectedPage>} />
          <Route path="/insurance" element={<ProtectedPage><Insurance /></ProtectedPage>} />
          <Route path="/payments" element={<ProtectedPage><Payment /></ProtectedPage>} />
          <Route path="/claims" element={<ProtectedPage><Claims /></ProtectedPage>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedPage adminOnly><AdminDashboard /></ProtectedPage>} />
          <Route path="/admin/customers" element={<ProtectedPage adminOnly><Customers /></ProtectedPage>} />
          <Route path="/admin/insurance" element={<ProtectedPage adminOnly><AdminInsurances /></ProtectedPage>} />
          <Route path="/admin/claims" element={<ProtectedPage adminOnly><CustomerClaims /></ProtectedPage>} />
          <Route path="/admin/payments" element={<ProtectedPage adminOnly><CustomerPayments /></ProtectedPage>} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
