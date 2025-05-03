import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Admin/Users";
import Claims from "./pages/Admin/Claims";
import MyProfile from "./pages/Customer/MyProfile";
import NewVehicle from "./pages/Customer/NewVehicle";
import BuyInsurance from "./pages/Customer/BuyInsurance";
import FileClaim from "./pages/Customer/FileClaim";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/claims"
          element={
            <ProtectedRoute role="admin">
              <Claims />
            </ProtectedRoute>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/customer/profile"
          element={
            <ProtectedRoute role="customer">
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/new-vehicle"
          element={
            <ProtectedRoute role="customer">
              <NewVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/buy-insurance"
          element={
            <ProtectedRoute role="customer">
              <BuyInsurance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/file-claim"
          element={
            <ProtectedRoute role="customer">
              <FileClaim />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
