import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaUserPlus,
  FaUserTimes,
  FaDesktop,
  FaUserNurse,
} from "react-icons/fa";
import { useAuth } from "../../context/authContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const basepath = `${user.user_id}`;
  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <div className="container mt-5 p-3">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>

      {/* Section 1: Overview */}
      <h5 className="mb-3">Overview</h5>
      <Row className="mb-4">
        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaUserMd size={35} className="mb-2 text-primary" />
              <Card.Title>Doctors</Card.Title>
              <Card.Text>Manage doctor profiles and details</Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate(`${basepath}/viewdoctors`)}
              >
                View Doctors
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaDesktop size={35} className="mb-2 text-dark" />
              <Card.Title>Front Desk</Card.Title>
              <Card.Text>Manage front desk staff</Card.Text>
              <Button
                variant="dark"
                onClick={() => navigate(`${basepath}/viewfrontdesk`)}
              >
                View FrontDesk
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaUserNurse size={35} className="mb-2 text-warning" />
              <Card.Title>Nurses</Card.Title>
              <Card.Text>Manage nurse staff</Card.Text>
              <Button
                variant="warning"
                onClick={() => navigate(`${basepath}/viewnurses`)}
              >
                View Nurses
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Section 2: User Management */}
      <h5 className="mb-3">User Management</h5>
      <Row className="mb-4">
        <Col md={6} sm={12} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaUserPlus size={35} className="mb-2 text-info" />
              <Card.Title>Add User</Card.Title>
              <Card.Text>Add doctors, frontdesk, nurses, or admins</Card.Text>
              <Button
                variant="info"
                onClick={() => navigate(`/admin/${user.user_id}/adduser`)}
              >
                Add User
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} sm={12} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaUserTimes size={35} className="mb-2 text-danger" />
              <Card.Title>Delete User</Card.Title>
              <Card.Text>Remove users from the system</Card.Text>
              <Button
                variant="danger"
                onClick={() => navigate(`/admin/${user.user_id}/deleteuser`)}
              >
                Delete User
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
