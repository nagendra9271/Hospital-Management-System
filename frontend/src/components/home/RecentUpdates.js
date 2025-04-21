// components/home/RecentUpdates.jsx
import React from "react";
import { Row, Col, Card, Table, Badge } from "react-bootstrap";
import { FaClock, FaCalendarAlt, FaUserInjured } from "react-icons/fa";

const RecentUpdates = ({ user }) => {
  // Mock recent appointments data - would come from API
  const recentAppointments = [
    {
      id: 1,
      patient: "Sarah Johnson",
      date: "Today, 11:30 AM",
      status: "Scheduled",
      type: "Consultation",
    },
    {
      id: 2,
      patient: "Mike Thompson",
      date: "Today, 2:00 PM",
      status: "Checked In",
      type: "Follow-up",
    },
    {
      id: 3,
      patient: "Emily Rodriguez",
      date: "Today, 3:15 PM",
      status: "Pending",
      type: "Test Results",
    },
    {
      id: 4,
      patient: "Robert Chen",
      date: "Tomorrow, 9:00 AM",
      status: "Scheduled",
      type: "New Patient",
    },
  ];

  // Mock recent patients data - would come from API
  const recentPatients = [
    {
      id: 101,
      name: "David Wilson",
      age: 45,
      lastVisit: "Today",
      status: "Admitted",
    },
    {
      id: 102,
      name: "Lisa Garcia",
      age: 32,
      lastVisit: "Yesterday",
      status: "Discharged",
    },
    {
      id: 103,
      name: "John Smith",
      age: 58,
      lastVisit: "2 days ago",
      status: "Treatment",
    },
    {
      id: 104,
      name: "Mary Johnson",
      age: 27,
      lastVisit: "2 days ago",
      status: "Follow-up",
    },
  ];

  const getStatusBadge = (status) => {
    let variant;
    switch (status) {
      case "Scheduled":
        variant = "primary";
        break;
      case "Checked In":
        variant = "success";
        break;
      case "Pending":
        variant = "warning";
        break;
      case "Admitted":
        variant = "danger";
        break;
      case "Discharged":
        variant = "info";
        break;
      case "Treatment":
        variant = "secondary";
        break;
      case "Follow-up":
        variant = "primary";
        break;
      default:
        variant = "secondary";
    }
    return <Badge bg={variant}>{status}</Badge>;
  };

  return (
    <div className="recent-updates-section mt-5">
      <h2 className="section-title mb-4">Recent Updates</h2>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="recent-card h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="card-header-title">
                <FaCalendarAlt className="me-2" />
                Recent Appointments
              </div>
              <div className="card-header-link">
                <a href="/appointments">View All</a>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.patient}</td>
                      <td>{appointment.type}</td>
                      <td>{appointment.date}</td>
                      <td>{getStatusBadge(appointment.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="recent-card h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="card-header-title">
                <FaUserInjured className="me-2" />
                Recent Patients
              </div>
              <div className="card-header-link">
                <a href="/patients">View All</a>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Last Visit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.name}</td>
                      <td>{patient.age}</td>
                      <td>{patient.lastVisit}</td>
                      <td>{getStatusBadge(patient.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RecentUpdates;
