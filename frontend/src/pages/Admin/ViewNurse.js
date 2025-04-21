import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../../components/UserCard";
import { FaPlus, FaSync, FaUser } from "react-icons/fa";
import "../../styles/UserCard.css";
import { useParams, useNavigate } from "react-router-dom";
import EditUserModal from "../../components/EditUserModal";
import ConfirmModal from "../../components/ConfirmModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewNurses = () => {
  const { id } = useParams();
  const [nurses, setNurses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNurses();
    toast.dismiss(); // Clear any previous toasts
  }, []);

  const fetchNurses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/nurse");
      setNurses(response.data);
    } catch (error) {
      toast.error("Error fetching nurses");
      console.error("Error fetching nurses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (nurse) => {
    setEditingNurse(nurse);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await axios.put(`/api/admin/staff/${editingNurse.user_id}`, updatedData);
      toast.success("Nurse updated successfully!");
      setIsEditModalOpen(false);
      setTimeout(() => {
        fetchNurses();
      }, 1000);
    } catch (error) {
      const msg = error?.response?.data?.error;
      toast.error(msg || "Error updating nurse");
    } finally {
      setIsEditModalOpen(false);
      setEditingNurse(null);
    }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/user/${userToDelete}`);
      toast.success("Nurse deleted successfully!");
      setTimeout(() => {
        fetchNurses();
      }, 1000);
    } catch (error) {
      const msg = error?.response?.data?.error;
      toast.error(msg || "Error deleting nurse");
    } finally {
      setIsConfirmModalOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredNurses = nurses.filter((nurse) =>
    nurse.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Nurse Management</h1>
        <button onClick={fetchNurses} className="btn btn-outline-primary">
          <FaSync className="me-2" /> Refresh
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8 mb-3">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search nurses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3 d-flex align-items-end">
              <button
                className="btn btn-primary w-100"
                onClick={() => navigate(`/admin/${id}/adduser`)}
              >
                <FaPlus className="me-2" /> Add New Nurse
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredNurses.length === 0 ? (
        <div className="text-center mt-5">
          <FaUser size={48} className="text-muted mb-3" />
          <h3 className="h4">No nurses found</h3>
          <p className="text-muted">
            {searchQuery
              ? "No nurses match your search criteria."
              : "There are no nurses in the system."}
          </p>
          <button
            className="btn btn-primary mt-3"
            oonClick={() => navigate(`/admin/${id}/adduser`)}
          >
            <FaPlus className="me-2" /> Add New Nurse
          </button>
        </div>
      ) : (
        <div className="row">
          {filteredNurses.map((nurse) => (
            <div className="col-12 mb-3" key={nurse.user_id}>
              <UserCard
                user={nurse}
                onEdit={handleEdit}
                onDelete={() => confirmDelete(nurse.u_id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Edit Nurse Modal */}
      {isEditModalOpen && (
        <EditUserModal
          show={isEditModalOpen}
          onHide={() => setIsEditModalOpen(false)}
          userData={editingNurse}
          onSave={handleSaveEdit}
          role="Nurse"
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        show={isConfirmModalOpen}
        onHide={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Nurse"
        body="Are you sure you want to delete this nurse? This action cannot be undone."
      />

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default ViewNurses;
