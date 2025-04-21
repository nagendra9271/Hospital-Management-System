import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaList, FaInbox, FaPrescriptionBottle, FaFlask } from "react-icons/fa";
import { useDoctor } from "../../context/DoctorContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { doctorDetails, loading } = useDoctor();
  const [showTestModal, setShowTestModal] = useState(false);

  const [testName, setTestName] = useState("");

  const id = doctorDetails?.d_id;

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/doctors/addtest", {
        test_name: testName,
      });
      toast.success("Test added successfully");
      setShowTestModal(false);
      // Optionally reset form
      setTestName("");
    } catch (err) {
      const msg = err?.response?.data?.error;
      toast.error(msg || "Failed to add test");
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container mt-5 p-3">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 className="mb-4 text-center">Doctor Dashboard</h2>

      <Row className="mb-4">
        {/* Existing cards... */}
        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body className="d-flex flex-column align-items-center">
              <FaList size={35} className="mb-2 text-primary" />
              <Card.Title>Patient List</Card.Title>
              <Card.Text>View and search patients under your care</Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate(`/doctor/${id}/patientlist`)}
              >
                View Patients
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body className="d-flex flex-column align-items-center">
              <FaInbox size={35} className="mb-2 text-success" />
              <Card.Title>Inbox</Card.Title>
              <Card.Text>See test results and emergency alerts</Card.Text>
              <Button
                variant="success"
                onClick={() => navigate(`/doctor/${id}/inbox`)}
              >
                Open Inbox
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body className="d-flex flex-column align-items-center">
              <FaFlask size={35} className="mb-2 text-info" />
              <Card.Title>Test Results</Card.Title>
              <Card.Text>Review tests and assign rooms</Card.Text>
              <Button
                variant="warning"
                onClick={() =>
                  navigate(`/doctor/${id}/testresultsroomassignment`)
                }
              >
                Test Results Room Assignment
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* 🆕 Add Test card (opens modal) */}
        <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body className="d-flex flex-column align-items-center">
              <FaPrescriptionBottle size={35} className="mb-2 text-warning" />
              <Card.Title>Add Test</Card.Title>
              <Card.Text>Add new tests</Card.Text>
              <Button variant="warning" onClick={() => setShowTestModal(true)}>
                Add Test
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 🧪 Add Test Modal */}
      <Modal show={showTestModal} onHide={() => setShowTestModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Test</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTestSubmit}>
          <Modal.Body>
            <Form.Group controlId="testName" className="mb-3">
              <Form.Label>Test Name</Form.Label>
              <Form.Control
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                required
              />
            </Form.Group>

            {/* <Form.Group controlId="testDate" className="mb-3">
              <Form.Label>Test Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="testResult" className="mb-3">
              <Form.Label>Test Result</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={testResult}
                onChange={(e) => setTestResult(e.target.value)}
              />
            </Form.Group> */}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTestModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Test
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
