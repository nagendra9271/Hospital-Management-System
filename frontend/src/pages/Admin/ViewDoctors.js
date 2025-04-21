import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard, { DoctorSpecificFields } from "../../components/UserCard";
import EditUserModal from "../../components/EditUserModal";
import ConfirmModal from "../../components/ConfirmModal";
import { FaPlus, FaSync, FaUser } from "react-icons/fa";
import "../../styles/UserCard.css";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorsPage = () => {
  const { id } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to fetch doctors");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await axios.put(
        `/api/admin/doctors/${selectedDoctor.user_id}`,
        updatedData
      );
      toast.success("Doctor updated successfully");
      setIsEditModalOpen(false);
      setTimeout(() => {
        fetchDoctors();
      }, 2000);
    } catch (error) {
      const msg = error?.response?.data?.error;
      // console.error("Error updating doctor:", error);
      toast.error(msg || "Failed to update doctor");
    }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/user/${userToDelete}`);
      toast.success("Doctor deleted successfully");
      fetchDoctors();
    } catch (error) {
      const msg = error?.response?.data?.error;
      // console.error("Error deleting doctor:", error);
      toast.error(msg || "Failed to delete doctor");
    } finally {
      setIsConfirmModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Doctor Management</h1>
        <button onClick={fetchDoctors} className="btn btn-outline-primary">
          <FaSync className="me-2" /> Refresh
        </button>
      </div>

      <div className="card shadow-sm mb-4 rounded-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8 mb-3">
              <label className="form-label fw-semibold">Search</label>
              <input
                type="text"
                className="form-control"
                style={{ borderRadius: "0.75rem" }}
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3 d-flex align-items-end">
              <button
                className="btn btn-primary w-100 rounded-3"
                onClick={() => navigate(`/admin/${id}/adduser`)}
              >
                <FaPlus className="me-2" /> Add New Doctor
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center mt-5">
          <FaUser size={48} className="text-muted mb-3" />
          <h3 className="h4">No doctors found</h3>
          <p className="text-muted">
            {searchQuery
              ? "No doctors match your search criteria."
              : "There are no doctors in the system."}
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate(`/admin/${id}/adduser`)}
          >
            <FaPlus className="me-2" /> Add New Doctor
          </button>
        </div>
      ) : (
        <div className="row">
          {filteredDoctors.map((doctor) => (
            <div className="col-12 mb-3" key={doctor.user_id}>
              <UserCard
                user={doctor}
                roleSpecificFields={<DoctorSpecificFields doctor={doctor} />}
                onEdit={handleEdit}
                onDelete={() => confirmDelete(doctor.user_id)}
              />
            </div>
          ))}
        </div>
      )}

      <EditUserModal
        show={isEditModalOpen}
        onHide={() => setIsEditModalOpen(false)}
        userData={selectedDoctor}
        onSave={handleSaveEdit}
        role="Doctor"
      />

      <ConfirmModal
        show={isConfirmModalOpen}
        onHide={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Doctor"
        body="Are you sure you want to delete this doctor? This action cannot be undone."
      />
    </div>
  );
};

export default DoctorsPage;
