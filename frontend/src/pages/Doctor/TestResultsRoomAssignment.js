import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Table,
  Button,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { FaFlask, FaBed, FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TestResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/doctors/${id}/getresults`);
        setPatients(res.data);
      } catch (err) {
        const msg = err?.response?.data?.error;
        toast.error(msg || "Failed to load patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [id]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handleAssignRoom = async (status) => {
    if (!selectedPatient) return;

    try {
      setLoading(true);
      await axios.patch(
        `/api/doctors/${id}/${selectedPatient.p_id}/admitpatient`,
        {
          admit: status === "admit" ? true : false,
        }
      );
      toast.success(
        `Patient ${selectedPatient.name} will be ${
          status === "admit" ? "admitted by Front Desk" : "discharged"
        }`
      );

      setPatients((prev) =>
        prev.filter((p) => p.p_id !== selectedPatient.p_id)
      );
      setSelectedPatient(null);
    } catch (err) {
      const msg = err?.response?.data?.error;
      toast.error(msg || "Failed to update patient status");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedPatient) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  //   if (error) {
  //     return (
  //       <Container className="mt-5">
  //         <Alert variant="danger">{error}</Alert>
  //         <Button onClick={() => window.location.reload()}>Retry</Button>
  //       </Container>
  //     );
  //   }

  return (
    <Container className="my-5">
      <h2 className="mb-3">
        <FaFlask className="me-2" />
        Patient Test Results Review
      </h2>
      <p className="text-muted mb-4">Doctor ID: {id}</p>

      {!selectedPatient ? (
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="mb-4 text-primary">Patients with Completed Tests</h5>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Tests Count</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No patients have completed tests at the moment.
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => (
                      <tr key={patient.p_id}>
                        <td>{patient.p_id}</td>
                        <td>{patient.name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.tests.length}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handlePatientSelect(patient)}
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <div>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-success">
                  {selectedPatient.name} (ID: {selectedPatient.p_id})
                </h4>
                <Button
                  variant="outline-secondary"
                  onClick={() => setSelectedPatient(null)}
                >
                  <FaArrowLeft className="me-2" />
                  Back to List
                </Button>
              </div>

              <Row>
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <h6 className="text-primary">Patient Info</h6>
                      <p>
                        <strong>Age:</strong> {selectedPatient.age}
                      </p>
                      <p>
                        <strong>Gender:</strong> {selectedPatient.gender}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={8}>
                  <Card>
                    <Card.Body>
                      <h6 className="text-primary mb-3">Test Details</h6>
                      <Table bordered responsive>
                        <thead>
                          <tr>
                            <th>Test Name</th>
                            <th>Date</th>
                            <th>Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPatient.tests.map((test) => (
                            <tr key={test.c_id}>
                              <td>{test.test_name}</td>
                              <td>
                                {new Date(test.t_date).toLocaleString("en-IN", {
                                  dateStyle: "medium",
                                })}
                              </td>

                              <td>{test.t_result}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Doctor's Action Section */}
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4 text-danger">
                <FaBed className="me-2" />
                Doctor's Action – Admit or Discharge
              </h5>

              <div className="d-flex justify-content-center gap-4 mb-4">
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => handleAssignRoom("admit")}
                  className="d-flex align-items-center"
                  disabled={loading}
                >
                  <FaCheck className="me-2" />
                  Admit Patient
                </Button>
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => handleAssignRoom("discharge")}
                  className="d-flex align-items-center"
                  disabled={loading}
                >
                  <FaTimes className="me-2" />
                  Discharge
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
};

export default TestResultsPage;
