import { Route, Routes } from "react-router-dom";
import SidebarLayout from "../components/sidebars/SidebarLayout";
import Inbox from "./Doctor/Inbox";
import React from "react";
import PatientList from "./Doctor/PatientList";
// import RecordTreatment from "./Doctor/RecordTreatment";
// import AddTest from "./Doctor/AddTest";
import Dashboard from "./Doctor/Dashboard"; // default component for /admin
import { useDoctor } from "../context/DoctorContext";
import TestResultsRoomAssignment from "./Doctor/TestResultsRoomAssignment";
// import { useAuth } from "../context/authContext";

export default function DoctorDashboard() {
  const { doctorDetails, loading } = useDoctor();
  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard doctorDetails={doctorDetails} />} />
        <Route
          path="/:id/inbox"
          element={
            <SidebarLayout>
              <Inbox />
            </SidebarLayout>
          }
        />
        <Route
          path="/:id/patientlist"
          element={
            <SidebarLayout>
              <PatientList />
            </SidebarLayout>
          }
        />
        {/* <Route
          path="/:id/addtest"
          element={
            <SidebarLayout>
              <AddTest />
            </SidebarLayout>
          }
        /> */}
        <Route
          path="/:id/testresultsroomassignment"
          element={
            <SidebarLayout>
              <TestResultsRoomAssignment />
            </SidebarLayout>
          }
        />
      </Routes>
    </div>
  );
}
