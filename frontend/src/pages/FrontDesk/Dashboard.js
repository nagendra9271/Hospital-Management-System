import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaCalendarAlt,
  FaListUl,
  FaUsers,
  FaProcedures,
  FaBed,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/authContext";

export default function FrontDeskDashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const frontDeskId = user?.user_id;

  return (
    <div className="container mt-5 p-3">
      <h2 className="mb-4 text-center">Front Desk Dashboard</h2>

      <Row className="mb-4">
        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaUserPlus size={35} className="mb-2 text-primary" />
              <Card.Title>Register Patient</Card.Title>
              <Card.Text>Add a new patient to the system</Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate(`/frontdesk/${frontDeskId}/addpatient`)}
              >
                Register
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaCalendarAlt size={35} className="mb-2 text-success" />
              <Card.Title>Appointment</Card.Title>
              <Card.Text>Book or manage appointments</Card.Text>
              <Button
                variant="success"
                onClick={() =>
                  navigate(`/frontdesk/${frontDeskId}/appointment`)
                }
                className="d-flex justify-content-center mx-auto"
              >
                Manage Appointments
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaProcedures size={35} className="mb-2 text-danger" />
              <Card.Title>Admit Patient</Card.Title>
              <Card.Text>Admit patient for treatment</Card.Text>
              <Button
                variant="danger"
                onClick={() =>
                  navigate(`/frontdesk/${frontDeskId}/admitpatient`)
                }
              >
                Admit Patient
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaSignOutAlt size={35} className="mb-2 text-success" />
              <Card.Title>Discharge Patient</Card.Title>
              <Card.Text>Process patient discharge</Card.Text>
              <Button
                variant="success"
                onClick={() =>
                  navigate(`/frontdesk/${frontDeskId}/dischargepatient`)
                }
                className="d-flex justify-content-center
                mx-auto"
              >
                Discharge Patient
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaUsers size={35} className="mb-2 text-warning" />
              <Card.Title>Doctors List</Card.Title>
              <Card.Text>View and search all doctors</Card.Text>
              <Button
                variant="warning"
                onClick={() =>
                  navigate(`/frontdesk/${frontDeskId}/doctorslist`)
                }
              >
                View Doctors
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaListUl size={35} className="mb-2 text-info" />
              <Card.Title>Patients List</Card.Title>
              <Card.Text>See all registered patients</Card.Text>
              <Button
                variant="info"
                onClick={() =>
                  navigate(`/frontdesk/${frontDeskId}/patientslist`)
                }
              >
                View Patients
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaBed size={35} className="mb-2 text-secondary" />
              <Card.Title>Rooms List</Card.Title>
              <Card.Text>Patient Room Details</Card.Text>
              <Button
                variant="secondary"
                onClick={() => navigate(`/frontdesk/${frontDeskId}/rooms`)}
              >
                Rooms List
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
