import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaClipboard, FaFileMedical, FaEdit } from "react-icons/fa";
import { useAuth } from "../../context/authContext";

export default function NurseDashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const id = user.user_id;
  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container mt-5 p-3">
      <h2 className="mb-4 text-center">Nurse Dashboard</h2>

      <Row className="mb-4">
        <Col md={6} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaFileMedical size={35} className="mb-2 text-success" />
              <Card.Title>Patient Data Entry</Card.Title>
              <Card.Text>Enter test results and observations</Card.Text>
              <Button
                variant="success"
                onClick={() => navigate(`/nurse/${id}/patientdataentry`)}
                className="d-flex justify-content-center
                mx-auto"
              >
                Enter Data
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaClipboard size={35} className="mb-2 text-primary" />
              <Card.Title>Document Update</Card.Title>
              <Card.Text>Upload patient-related documents and files</Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate(`/nurse/${id}/documentupdate`)}
              >
                Update Documents
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* <Col md={4} sm={6} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <FaEdit size={35} className="mb-2 text-warning" />
              <Card.Title>Patient Record Update</Card.Title>
              <Card.Text>Edit or update existing patient records</Card.Text>
              <Button
                variant="warning"
                onClick={() => navigate(`/nurse/${id}/patientrecordupdate`)}
              >
                Update Record
              </Button>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
    </div>
  );
}
