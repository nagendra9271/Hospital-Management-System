import React, { useState } from "react";
import DoctorSidebar from "./DoctorSideBar";
import AdminSidebar from "./AdminSidebar";
import FrontDeskSidebar from "./FrontDeskSidebar";
import NurseSidebar from "./NurseSidebar";
import { useAuth } from "../../context/authContext";
import "../../styles/sidebar.css";

export default function SidebarLayout({ children }) {
  const { user, loading } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const renderSidebar = () => {
    switch (user?.role) {
      case "Doctor":
        return <DoctorSidebar user={user} />;
      case "Admin":
        return <AdminSidebar user={user} />;
      case "FrontDesk":
        return <FrontDeskSidebar user={user} />;
      case "Nurse":
        return <NurseSidebar user={user} />;
      default:
        return <div className="text-muted">No Sidebar Available</div>;
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div
      className="container-fluid d-flex flex-row p-0"
      style={{ minHeight: "100vh" }}
    >
      {/* Sidebar - toggleable */}
      {sidebarVisible && (
        <div
          className="sidebar-wrapper d-flex flex-column shadow-sm"
          style={{ background: "#f8f9fa", width: "250px", minHeight: "100vh" }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-0">
            <h5 className="mb-0">{user?.role} Panel</h5>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={toggleSidebar}
              title="Hide Sidebar"
            >
              ×
            </button>
          </div>

          {/* Sidebar content (menu) */}
          {renderSidebar()}
        </div>
      )}

      {/* Main content */}
      <div
        className="flex-grow-1 p-3"
        style={{
          marginLeft: sidebarVisible ? "250px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        {!sidebarVisible && (
          <button
            className="btn btn-outline-primary"
            onClick={toggleSidebar}
            title="Show Sidebar"
          >
            ☰ Show Sidebar
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
