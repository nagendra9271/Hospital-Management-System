import { Route, Routes } from "react-router-dom";
import SidebarLayout from "../components/sidebars/SidebarLayout";
import React from "react"; // default component for /admin
import { useAuth } from "../context/authContext";
import DocumentUpdate from "./Nurse/DocumentUpdate";
import Dashboard from "./Nurse/Dashboard";
import PatientDataEntry from "./Nurse/PatientDataEntry";
// import PatientRecordsDashboard from "./Nurse/PatientRecordsDashboard";
// import PatientRecordUpdate from "./Nurse/PatientRecordUpdate";

export default function NurseDashboard() {
  const { user } = useAuth();
  return (
    <SidebarLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/:id/documentupdate" element={<DocumentUpdate />} />
        {/* <Route
          path="/patientrecordsdashboard"
          element={<PatientRecordsDashboard />}
        /> */}
        <Route path="/:id/patientdataentry" element={<PatientDataEntry />} />
        <Route path="/documentupdate" element={<DocumentUpdate />} />
        {/* <Route
          path="/:id/patientrecordupdate"
          element={<PatientRecordUpdate currentUser={user} />}
        /> */}
      </Routes>
    </SidebarLayout>
  );
}
