import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import ConfirmModal from "../../components/ConfirmModal";
import { useParams } from "react-router-dom";
import {
  FiCalendar,
  FiCheckCircle,
  FiX,
  FiFileText,
  FiRefreshCw,
  FiActivity,
  FiAlertTriangle,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";

import PatientHistoryModal from "../../components/PatientHistoryModel";
import PrescriptionModal from "./PrescriptionModal";
import ConductTestModal from "./ConductTestModal";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Inbox.css";

const STATUS_OPTIONS = ["Scheduled", "Completed", "Cancelled"];
const PRIORITY_OPTIONS = ["high", "medium", "low"];

const Inbox = () => {
  const { id: d_id } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showPatientHistoryModal, setPatientHistoryShowModal] = useState(false);
  const [patientHistory, setPatientHistory] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPrescriptionApp, setSelectedPrescriptionApp] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedTestApp, setSelectedTestApp] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/doctors/${d_id}/appointments`);
      const { appointments, ...rest } = res.data;
      setAppointments(appointments);
      setStats(rest);
    } catch (err) {
      toast.error("Failed to fetch appointments");
    } finally {
      setIsLoading(false);
    }
  }, [d_id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const confirmStatusChange = (app_id, newStatus, admit = null) => {
    if (newStatus === "Cancelled") {
      setPendingStatusChange({ app_id, newStatus, admit });
      setShowConfirmModal(true);
    } else {
      handleStatusChange(app_id, newStatus, admit);
    }
  };

  const confirmAndExecuteStatusChange = () => {
    if (pendingStatusChange) {
      const { app_id, newStatus, admit } = pendingStatusChange;
      handleStatusChange(app_id, newStatus, admit);
    }
    setShowConfirmModal(false);
    setPendingStatusChange(null);
  };

  const handleStatusChange = async (app_id, newStatus, admit = null) => {
    try {
      await axios.patch(`/api/doctors/${app_id}/status`, {
        status: newStatus,
        ...(admit !== null && { admit }),
      });
      toast.success(`Marked as ${newStatus}${admit ? " and admitted" : ""}`);
      fetchAppointments();
    } catch (err) {
      toast.error(
        err?.response?.data?.error || "Update Appointment Status Failed"
      );
    }
  };

  const openPatientHistory = async (p_id) => {
    try {
      const res = await axios.get(
        `/api/doctors/${d_id}/patienthistory/${p_id}`
      );
      setPatientHistory(res.data);
      setPatientHistoryShowModal(true);
    } catch {
      toast.error("Failed to load patient history");
    }
  };

  const openPrescriptionModal = (appointment) => {
    setSelectedPrescriptionApp(appointment);
    setShowPrescriptionModal(true);
  };

  const submitPrescription = async ({ app_id, description, prescription }) => {
    try {
      await axios.post(`/api/doctors/${app_id}/treatment`, {
        description,
        prescription,
      });
      toast.success("Prescription submitted");
      fetchAppointments();
    } catch {
      toast.error("Error submitting prescription");
    }
  };

  const filteredAppointments = useMemo(() => {
    if (filter === "all") return appointments;
    if (PRIORITY_OPTIONS.includes(filter)) {
      return appointments.filter(
        (app) => app.priority?.toLowerCase() === filter
      );
    }
    if (STATUS_OPTIONS.includes(filter)) {
      return appointments.filter(
        (app) => app.status?.toLowerCase() === filter.toLowerCase()
      );
    }
    return appointments;
  }, [appointments, filter]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="inbox-container">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          icon={<FiCalendar />}
          title="Today Appointments"
          count={stats.todayAppointments}
          color="blue"
        />
        <StatCard
          icon={<FiCheckCircle />}
          title="Scheduled"
          count={stats.scheduled}
          color="green"
        />
        <StatCard
          icon={<FiActivity />}
          title="Completed"
          count={stats.completed}
          color="purple"
        />
        <StatCard
          icon={<FiAlertTriangle />}
          title="High Priority"
          count={appointments.filter((a) => a.priority === "High").length}
          color="red"
        />
      </div>

      {/* Header & Filter */}
      <div className="filter-header">
        <div>
          <h2 className="section-title">Appointment Management</h2>
          <p className="section-subtitle">Doctor ID: {d_id}</p>
        </div>
        <div className="filter-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <optgroup label="By Status">
              <option value="all">All Appointments</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </optgroup>
            <optgroup label="By Priority">
              {PRIORITY_OPTIONS.map((priority) => (
                <option key={priority} value={priority}>
                  {priority[0].toUpperCase() + priority.slice(1)} Priority
                </option>
              ))}
            </optgroup>
          </select>
          <button
            onClick={fetchAppointments}
            className="btn btn-outline-primary"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Appointment Cards */}
      {filteredAppointments.length === 0 ? (
        <div className="no-appointments">
          <h3>No appointments found</h3>
          <p>
            {filter === "all"
              ? "There are no appointments currently in the system."
              : `No appointments match the "${filter}" filter.`}
          </p>
        </div>
      ) : (
        filteredAppointments.map((app) => (
          <AppointmentCard
            key={app.app_id}
            appointment={app}
            onViewHistory={() => openPatientHistory(app.p_id)}
            onPrescription={() => openPrescriptionModal(app)}
            onConductTest={() => {
              setSelectedTestApp(app);
              setShowTestModal(true);
            }}
            onCancel={() => confirmStatusChange(app.app_id, "Cancelled")}
          />
        ))
      )}

      {/* Modals */}
      {showPatientHistoryModal && (
        <PatientHistoryModal
          historyData={patientHistory}
          onClose={() => setPatientHistoryShowModal(false)}
        />
      )}
      {showPrescriptionModal && selectedPrescriptionApp && (
        <PrescriptionModal
          appointment={selectedPrescriptionApp}
          onClose={() => setShowPrescriptionModal(false)}
          onSubmit={submitPrescription}
        />
      )}
      {showTestModal && selectedTestApp && (
        <ConductTestModal
          appointment={selectedTestApp}
          d_id={d_id}
          onClose={() => setShowTestModal(false)}
          onSubmitSuccess={fetchAppointments}
        />
      )}
      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={confirmAndExecuteStatusChange}
        title="Confirm Cancellation"
        body="Are you sure you want to cancel this appointment?"
      />
    </div>
  );
};

const StatCard = ({ icon, title, count, color }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-icon">{icon}</div>
    <div>
      <h4>{title}</h4>
      <p>{count}</p>
    </div>
  </div>
);

const AppointmentCard = ({
  appointment,
  onViewHistory,
  onPrescription,
  onConductTest,
  onCancel,
}) => {
  const { p_id, patient_name, priority, a_date, symptoms, status } =
    appointment;

  return (
    <div className={`simple-appointment-card ${priority?.toLowerCase()}`}>
      <div className="simple-appointment-header">
        <div className="appointment-title-row">
          <h3>Name: {patient_name || `#${p_id}`}</h3>
          <ActionButton
            icon={<FiFileText />}
            text="Patient Details"
            color="purple"
            onClick={onViewHistory}
          />
        </div>
        <p>
          <strong>Priority:</strong> {priority || "N/A"}
        </p>
        <p>
          <strong>Date:</strong> {new Date(a_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Symptoms:</strong> {symptoms || "No symptoms recorded."}
        </p>
      </div>

      {status === "Scheduled" && (
        <div className="simple-appointment-actions">
          <ActionButton
            icon={<FiFileText />}
            text="Prescription"
            color="green"
            onClick={onPrescription}
          />
          <ActionButton
            icon={<FiActivity />}
            text="Conduct Test"
            color="blue"
            onClick={onConductTest}
          />
          <ActionButton
            icon={<FiX />}
            text="Cancel"
            color="red"
            onClick={onCancel}
          />
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ icon, text, color, onClick }) => (
  <button className={`action-button ${color}`} onClick={onClick}>
    {icon} {text}
  </button>
);

export default Inbox;
