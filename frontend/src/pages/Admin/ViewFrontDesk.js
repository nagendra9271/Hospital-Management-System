import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../../components/UserCard";
import { FaPlus, FaSync, FaUser } from "react-icons/fa";
import "../../styles/UserCard.css";
import { useParams, useNavigate } from "react-router-dom";
import EditUserModal from "../../components/EditUserModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../../components/ConfirmModal"; // Import the ConfirmModal

const ViewFrontDesk = () => {
  const { id } = useParams();
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State to control ConfirmModal visibility
  const [userToDelete, setUserToDelete] = useState(null); // State for the user to delete
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
    toast.dismiss(); // Avoid duplicates
  }, []);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/frontdesk");
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching front desk staff:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await axios.put(`/api/admin/staff/${editingUser.user_id}`, updatedData);
      toast.success("User updated successfully!");
      setIsEditModalOpen(false);
      setTimeout(() => {
        fetchStaff();
      }, 2000);
    } catch (error) {
      const msg = error?.response?.data?.error;
      toast.error(msg || "Error updating nurse");
    } finally {
      setIsEditModalOpen(false);
      setEditingUser(null);
    }
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId); // Set the user to delete
    setIsConfirmModalOpen(true); // Open the confirm modal
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/user/${userToDelete}`);
      toast.success("Front Desk deleted successfully!");
      setIsConfirmModalOpen(false); // Close confirm modal
      setTimeout(() => {
        fetchStaff();
      }, 1000);
    } catch (error) {
      const msg = error?.response?.data?.error;
      toast.error(msg || "Error deleting user");
      setIsConfirmModalOpen(false); // Close confirm modal
    }
  };

  const filteredStaff = staff.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="h2">Front Desk Management</h1>
        <button onClick={fetchStaff} className="btn btn-outline-primary">
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
                placeholder="Search Front Desk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3 d-flex align-items-end">
              <button
                className="btn btn-primary w-100"
                onClick={() => navigate(`/admin/${id}/adduser`)}
              >
                <FaPlus className="me-2" /> Add New Front Desk
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredStaff.length === 0 ? (
        <div className="text-center mt-5">
          <FaUser size={48} className="text-muted mb-3" />
          <h3 className="h4">No staff found</h3>
          <p className="text-muted">
            {searchQuery
              ? "No staff match your search criteria."
              : "There are no staff in the system."}
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate(`/admin/${id}/adduser`)}
          >
            <FaPlus className="me-2" /> Add New Front Desk
          </button>
        </div>
      ) : (
        <div className="row">
          {filteredStaff.map((staff) => (
            <div className="col-12 mb-3" key={staff.user_id}>
              <UserCard
                user={staff}
                onEdit={handleEdit}
                onDelete={() => handleDelete(staff.u_id)} // Pass delete function
              />
            </div>
          ))}
        </div>
      )}

      {/* Edit Front Desk Modal */}
      {isEditModalOpen && (
        <EditUserModal
          show={isEditModalOpen}
          onHide={() => setIsEditModalOpen(false)}
          userData={editingUser}
          onSave={handleSaveEdit}
          role="Front Desk"
        />
      )}

      {/* Confirm Modal for Deletion */}
      <ConfirmModal
        show={isConfirmModalOpen}
        onHide={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Front Desk"
        body="Are you sure you want to delete this front desk staff? This action cannot be undone."
      />

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default ViewFrontDesk;
