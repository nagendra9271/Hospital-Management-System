import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Alert,
  Spinner,
  Tab,
  Tabs,
  Form,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaProcedures, FaUserMd, FaBed } from "react-icons/fa";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";
import EmergencyAdmission from "./EmergencyAdmission";

const AdmitPatient = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("recommendations");
  const [rooms, setRooms] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // In a real app, these would be actual API calls
        const roomsResponse = await axios.get("/api/frontdesk/rooms/available");
        const recommendationsResponse = await axios.get(
          "/api/frontdesk/admissions/recommendations"
        );

        setRooms(roomsResponse.data);
        setRecommendations(recommendationsResponse.data);
      } catch (error) {
        const msg = error?.response?.data?.error;
        toast.error("Failed to load data:" + msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRecommendationSelect = (recommendation) => {
    setSelectedRecommendation(recommendation);
  };

  const admitFromRecommendation = async () => {
    if (!selectedRecommendation) {
      toast.warning("Please select a recommendation");
      return;
    }
    const selectedRoomId = document.getElementById("roomSelect").value;
    if (!selectedRoomId) {
      toast.error("Please select a room before admitting the patient");
      return;
    }
    try {
      setLoading(true);

      // In a real app, this would be an actual API call
      await axios.post("/api/frontdesk/admitpatient", {
        p_id: selectedRecommendation.patient.p_id,
        d_id: selectedRecommendation.doctor.d_id,
        r_id: selectedRoomId,
      });

      toast.success(
        `Patient ${selectedRecommendation.patient.name} admitted successfully`
      );
      setSelectedRecommendation(null);
      setRooms((prev) =>
        prev.filter((room) => room.r_id !== parseInt(selectedRoomId))
      );

      // Refresh recommendations list
      const res = await axios.get("/api/frontdesk/admissions/recommendations");
      setRecommendations(res.data);
    } catch (error) {
      const msg = error?.response?.data?.error;
      toast.error(msg || "Failed to admit patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <FaProcedures className="me-2" />
        Patient Admission
      </h2>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        fill
      >
        <Tab eventKey="recommendations" title="Doctor Recommendations">
          <Card className="shadow-sm mt-3">
            <Card.Body>
              <h4 className="mb-4">
                <FaUserMd className="me-2" />
                Doctor Recommendations for Admission
              </h4>

              {loading && !selectedRecommendation ? (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                <>
                  <Row>
                    <Col md={8}>
                      <div
                        className="recommendation-list"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        {recommendations.length > 0 ? (
                          recommendations.map((rec) => (
                            <Card
                              key={rec.id}
                              className={`mb-3 cursor-pointer ${
                                selectedRecommendation?.id === rec.id
                                  ? "border-primary"
                                  : ""
                              }`}
                              onClick={() => handleRecommendationSelect(rec)}
                            >
                              <Card.Body>
                                <Row>
                                  <Col md={6}>
                                    <h5>{rec.patient.name}</h5>
                                    <p className="text-muted mb-1">
                                      Age: {rec.patient.age} |{" "}
                                      {rec.patient.gender} |{" "}
                                      {rec.patient.bloodGroup}
                                    </p>
                                    <p className="mb-1">
                                      <small>
                                        Phone: {rec.patient.phoneno}
                                      </small>
                                    </p>
                                  </Col>
                                  <Col md={6}>
                                    <p className="mb-1">
                                      <strong>Doctor:</strong> Dr.{" "}
                                      {rec.doctor.name}
                                    </p>
                                    <p className="text-muted mb-1">
                                      {rec.doctor.specialization} &mdash;{" "}
                                      {rec.doctor.degree},{" "}
                                      {rec.doctor.experience} yrs
                                    </p>
                                  </Col>
                                  {/* <Col md={4}>
                                    <p className="mb-1">
                                      <strong>Tests:</strong>{" "}
                                      {2 || rec.tests.length}
                                    </p>
                                    <small className="text-muted">
                                      Date: {rec.admitDate}
                                    </small>
                                  </Col> */}
                                </Row>
                              </Card.Body>
                            </Card>
                          ))
                        ) : (
                          <Alert variant="info">
                            No admission recommendations from doctors at this
                            time.
                          </Alert>
                        )}
                      </div>
                    </Col>

                    <Col md={4}>
                      <Card className="sticky-top" style={{ top: "20px" }}>
                        <Card.Body>
                          <h5>Admission Details</h5>
                          {selectedRecommendation ? (
                            <>
                              <div className="mb-3">
                                <h6>Patient Information</h6>
                                <p>
                                  <strong>Name:</strong>{" "}
                                  {selectedRecommendation.patient.name}
                                </p>
                                <p>
                                  <strong>Age/Gender:</strong>{" "}
                                  {selectedRecommendation.patient.age} /{" "}
                                  {selectedRecommendation.patient.gender}
                                </p>
                                <p>
                                  <strong>Blood Group:</strong>{" "}
                                  {selectedRecommendation.patient.bloodGroup}
                                </p>
                                <p>
                                  <strong>Contact:</strong>{" "}
                                  {selectedRecommendation.patient.phoneno}
                                </p>
                              </div>

                              <Form.Group className="mb-3">
                                <Form.Label>Assign Room</Form.Label>
                                <Form.Select id="roomSelect" required>
                                  <option value="">Select room</option>
                                  {rooms?.map((room) => (
                                    <option key={room?.r_id} value={room?.r_id}>
                                      Room #{room?.r_id}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>

                              <Button
                                variant="primary"
                                onClick={admitFromRecommendation}
                                disabled={loading}
                                className="w-100"
                              >
                                {loading ? (
                                  <Spinner size="sm" />
                                ) : (
                                  <>
                                    <FaBed className="me-2" />
                                    Confirm Admission
                                  </>
                                )}
                              </Button>
                            </>
                          ) : (
                            <div className="text-center text-muted py-3">
                              Select a recommendation to admit patient
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="emergency" title="Emergency Admission">
          <EmergencyAdmission rooms={[]} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdmitPatient;
