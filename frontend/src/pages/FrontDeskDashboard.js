import { Route, Routes } from "react-router-dom";
import SidebarLayout from "../components/sidebars/SidebarLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { useAuth } from "../context/authContext";
import Appointment from "./FrontDesk/Appointment";
import Dashboard from "./FrontDesk/Dashboard";
import PatientForm from "./FrontDesk/AddPatient";
import DoctorsList from "./FrontDesk/DoctorsList";
import Patientslist from "./FrontDesk/Patientslist";
import AdmitPatient from "./FrontDesk/AdmitPatient";
import DischargePatients from "./FrontDesk/DischargePatient";
import RoomsList from "./FrontDesk/RoomsList";

export default function FrontDeskDashboard() {
  const { user } = useAuth();
  return (
    <SidebarLayout>
      <ToastContainer position="top-right" autoClose={1500} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/:id/addpatient" element={<PatientForm />} />
        <Route
          path="/:id/appointment"
          element={<Appointment currentUser={user} />}
        />
        <Route path="/:id/doctorslist" element={<DoctorsList />} />
        <Route path="/:id/patientslist" element={<Patientslist />} />
        <Route path="/:id/admitpatient" element={<AdmitPatient />} />
        <Route path="/:id/dischargepatient" element={<DischargePatients />} />
        <Route path="/:id/rooms" element={<RoomsList />} />
      </Routes>
    </SidebarLayout>
  );
}
