import React from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiAward,
  FiClock,
  FiKey,
} from "react-icons/fi";

const UserCard = ({
  user,
  roleSpecificFields,
  onEdit,
  onDelete,
  additionalActions,
}) => {
  return (
    <div className="card border-primary mb-3">
      <div className="card-body">
        <div className="d-flex align-items-start mb-3">
          <div className="me-3 text-primary">
            <FiUser size={24} />
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <h4 className="card-title mb-0">{user?.name}</h4>
              <span className="badge bg-secondary text-capitalize">
                {user?.role}
              </span>
            </div>

            <div className="row mt-3">
              <div className="col-md-4 mb-2 d-flex align-items-center text-muted">
                <FiMail className="me-2" />
                <span>{user?.email}</span>
              </div>
              <div className="col-md-4 mb-2 d-flex align-items-center text-muted">
                <FiPhone className="me-2" />
                <span>{user?.phone_no || "Not provided"}</span>
              </div>
              <div className="col-md-4 mb-2 d-flex align-items-center text-muted">
                <FiKey className="me-2" />
                <span>{user?.password ? "••••••••" : "Not set"}</span>
              </div>
            </div>

            {roleSpecificFields && (
              <div className="row mt-2">{roleSpecificFields}</div>
            )}
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button
            onClick={() => onEdit(user)}
            className="btn btn-outline-primary btn-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(user.user_id)}
            className="btn btn-outline-danger btn-sm"
          >
            Delete
          </button>
          {additionalActions && additionalActions}
        </div>
      </div>
    </div>
  );
};

export const DoctorSpecificFields = ({ doctor }) => (
  <>
    <div className="col-md-4 d-flex align-items-center text-muted mb-2">
      <FiBriefcase className="me-2" />
      <span>{doctor.specialization || "General"}</span>
    </div>
    <div className="col-md-4 d-flex align-items-center text-muted mb-2">
      <FiAward className="me-2" />
      <span>{doctor.degree || "N/A"}</span>
    </div>
    <div className="col-md-4 d-flex align-items-center text-muted mb-2">
      <FiClock className="me-2" />
      <span>{doctor.experience || 0} years experience</span>
    </div>
  </>
);

export default UserCard;
