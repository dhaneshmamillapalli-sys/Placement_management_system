import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Drives from "./pages/Drives";
import DriveDetails from "./pages/DriveDetails";
import Applications from "./pages/Applications";
import Students from "./pages/Students";
import Profile from "./pages/Profile";

function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/drives"
          element={
            <PrivateRoute>
              <Drives />
            </PrivateRoute>
          }
        />
        <Route
          path="/drives/:id"
          element={
            <PrivateRoute>
              <DriveDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <Applications />
            </PrivateRoute>
          }
        />
        <Route
          path="/students"
          element={
            <PrivateRoute allowedRoles={["admin", "recruiter"]}>
              <Students />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </>
  );
}

export default App;
