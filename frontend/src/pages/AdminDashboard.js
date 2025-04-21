import { Route, Routes } from "react-router-dom";
import AddUser from "./Admin/AddUser";
import DeleteUser from "./Admin/DeleteUser";
import Dashboard from "./Admin/Dashboard";
import SidebarLayout from "../components/sidebars/SidebarLayout";
import React from "react";
import { useAuth } from "../context/authContext";
import ViewDoctors from "./Admin/ViewDoctors";
import ViewFrontDesk from "./Admin/ViewFrontDesk";
import ViewNurses from "./Admin/ViewNurse";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <Routes>
        {/* Render dashboard without sidebar */}
        <Route path="/" element={<Dashboard />} />

        {/* Routes that include sidebar layout */}
        <Route
          path="/:id/adduser"
          element={
            <SidebarLayout>
              <AddUser />
            </SidebarLayout>
          }
        />
        <Route
          path="/:id/deleteuser"
          element={
            <SidebarLayout>
              <DeleteUser currentUser={user} />
            </SidebarLayout>
          }
        />
        <Route
          path="/:id/viewdoctors"
          element={
            <SidebarLayout>
              <ViewDoctors />
            </SidebarLayout>
          }
        />
        <Route
          path="/:id/viewfrontdesk"
          element={
            <SidebarLayout>
              <ViewFrontDesk />
            </SidebarLayout>
          }
        />
        <Route
          path="/:id/viewnurses"
          element={
            <SidebarLayout>
              <ViewNurses />
            </SidebarLayout>
          }
        />
        {/* Add more routes similarly if needed */}
      </Routes>
    </div>
  );
}
