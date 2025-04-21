import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import CustomNavbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import { AuthProvider, useAuth } from "./context/authContext";
import { DoctorProvider } from "./context/DoctorContext";
import FrontDeskDashboard from "./pages/FrontDeskDashboard";
import NurseDashboard from "./pages/NurseDashboard";
import ProfilePage from "./pages/Profile";
import HomePage from "./pages/homeex";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export function ProtectedRoute({ role, children }) {
  const { isLoggedIn, loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role === "any" || role === user.role) {
    return children;
  }
  console.log(user);
  return <Navigate to={`/${user.role.toLowerCase()}`} />;
}

export function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthProvider>
      <CustomNavbar />
      <div className="" style={{ marginTop: "56px" }}>
        <ToastContainer position="top-right" autoClose={2000} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="any">
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/frontdesk/*"
            element={
              <ProtectedRoute role="FrontDesk">
                <FrontDeskDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute role="Doctor">
                <DoctorProvider>
                  <DoctorDashboard />
                </DoctorProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/*"
            element={
              <ProtectedRoute role="Nurse">
                <NurseDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Home />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
