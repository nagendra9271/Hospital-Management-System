import React, { useState, useEffect } from "react";
import {
  Table,
  Badge,
  Container,
  Button,
  Spinner,
  ButtonGroup,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { FaEye, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/PatientList.css";
import PatientHistoryModal from "../../components/PatientHistoryModel";

const PatientList = () => {
  const { id } = useParams(); // doctor ID
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPatientHistoryModal, setShowPatientHistoryModal] = useState(false);
  const [patientHistory, setPatientHistory] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`/api/doctors/${id}/patientlist`);
        setPatients(response.data);
      } catch (error) {
        toast.error("Error fetching patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [id]);

  const openPatientHistory = async (p_id) => {
    try {
      const response = await axios.get(
        `/api/doctors/${id}/patienthistory/${p_id}`
      );
      setPatientHistory(response.data);
      setShowPatientHistoryModal(true);
    } catch {
      toast.error("Error fetching patient history");
    }
  };
  const filteredPatients = patients.filter((patient) => {
    const nameMatch = patient.PatientName.toLowerCase().includes(
      searchName.toLowerCase()
    );
    const statusMatch =
      statusFilter === "all" ||
      patient.Status.toLowerCase() === statusFilter.toLowerCase();
    return nameMatch && statusMatch;
  });
  const getStatusBadge = (status) => {
    const statusMap = {
      scheduled: "warning",
      completed: "success",
      cancelled: "danger",
    };

    return (
      <Badge bg={statusMap[status?.toLowerCase()] || "secondary"}>
        {status}
      </Badge>
    );
  };

  return (
    <Container className="py-4">
      <ToastContainer />
      <h3 className="mb-4">
        <FaUser className="me-2" /> Patient List
      </h3>
      <Row className="mb-3">
        <Col md={6}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by patient name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p>Loading patients...</p>
        </div>
      ) : patients.length ? (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Symptoms</th>
                <th>Appointment Date</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length ? (
                filteredPatients.map((patient, index) => (
                  <tr key={index}>
                    <td>{patient.PatientID}</td>
                    <td>{patient.PatientName}</td>
                    <td>{patient.Symptoms}</td>
                    <td>
                      {new Date(patient.AppointmentDate).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        }
                      )}
                    </td>
                    <td>{getStatusBadge(patient.Status)}</td>
                    <td className="text-center">
                      <ButtonGroup>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          title="View History"
                          onClick={() => openPatientHistory(patient.PatientID)}
                        >
                          <FaEye />
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No patients found matching <strong>{searchName}</strong>{" "}
                    with status <strong>{statusFilter}</strong>.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="text-center">
          <p>No patients found.</p>
        </div>
      )}

      {showPatientHistoryModal && (
        <PatientHistoryModal
          historyData={patientHistory}
          onClose={() => setShowPatientHistoryModal(false)}
        />
      )}
    </Container>
  );
};

export default PatientList;
