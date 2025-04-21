import React from "react";
import { Card, Button } from "react-bootstrap";
import {
  FaArrowRight,
  FaUserMd,
  FaUserNurse,
  FaUserCog,
  FaUserEdit,
} from "react-icons/fa";

const DashboardAccess = ({ user, goToDashboard }) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case "Doctor":
        return <FaUserMd size={24} />;
      case "Nurse":
        return <FaUserNurse size={24} />;
      case "Admin":
        return <FaUserCog size={24} />;
      case "FrontDesk":
        return <FaUserEdit size={24} />;
      default:
        return <FaUserMd size={24} />;
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case "Doctor":
        return "Access your patient records, appointments, and treatment plans";
      case "Nurse":
        return "Manage patient care, medications, and daily records";
      case "Admin":
        return "Monitor system performance and manage staff accounts";
      case "FrontDesk":
        return "Process admissions, schedule appointments, and handle patient inquiries";
      default:
        return "Access your personalized dashboard";
    }
  };

  return (
    <Card className="dashboard-access-card">
      <Card.Body>
        <div className="dashboard-icon">{getRoleIcon(user.role)}</div>
        <div className="dashboard-content">
          <Card.Title>{user.role} Dashboard</Card.Title>
          <Card.Text>{getRoleDescription(user.role)}</Card.Text>
        </div>
        <Button
          variant="primary"
          className="btn-access"
          onClick={goToDashboard}
        >
          Go to Dashboard
          <FaArrowRight className="ms-2" />
        </Button>
      </Card.Body>
    </Card>
  );
};

export default DashboardAccess;
