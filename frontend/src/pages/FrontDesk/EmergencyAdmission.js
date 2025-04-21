import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { FaExclamationTriangle, FaBed } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const EmergencyAdmission = ({ rooms }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "Male",
    bloodGroup: "A+",
    phoneNo: "",
    symptoms: "",
    priority: "High",
    doctor: "",
    tests: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestSelect = (e) => {
    const options = e.target.options;
    const selectedTests = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedTests.push(options[i].value);
      }
    }
    setFormData((prev) => ({
      ...prev,
      tests: selectedTests,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.patientName || !formData.symptoms) {
        throw new Error("Patient name and symptoms are required");
      }

      // In a real app, this would be an actual API call
      await axios.post("/api/admissions/emergency", {
        ...formData,
        roomId: document.getElementById("emergencyRoomSelect").value,
      });

      toast.success(
        `Emergency admission for ${formData.patientName} created successfully`
      );

      // Reset form
      setFormData({
        patientName: "",
        age: "",
        gender: "Male",
        bloodGroup: "A+",
        phoneNo: "",
        symptoms: "",
        priority: "High",
        doctor: "",
        tests: [],
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      patientName: "",
      age: "",
      gender: "Male",
      bloodGroup: "A+",
      phoneNo: "",
      symptoms: "",
      priority: "High",
      doctor: "",
      tests: [],
    });
  };

  // Dummy data - in a real app, these would come from props or API
  const dummyDoctors = [
    { d_id: 1, specialization: "Cardiology" },
    { d_id: 2, specialization: "Neurology" },
  ];

  const dummyTests = [
    { t_id: 1, test_name: "Blood Test" },
    { t_id: 2, test_name: "X-Ray" },
    { t_id: 3, test_name: "MRI Scan" },
    { t_id: 4, test_name: "ECG" },
  ];

  return (
    <Card className="shadow-sm mt-3 border-danger">
      <Card.Body>
        <h4 className="mb-4 text-danger">
          <FaExclamationTriangle className="me-2" />
          Emergency Admission
        </h4>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="patientName">
                <Form.Label>Patient Name</Form.Label>
                <Form.Control
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  placeholder="Enter patient full name"
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="age">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="bloodGroup">
                <Form.Label>Blood Group</Form.Label>
                <Form.Select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="phoneNo">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  placeholder="Phone number"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="priority">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={8}>
              <Form.Group controlId="symptoms">
                <Form.Label>Symptoms/Condition</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  required
                  placeholder="Describe symptoms and condition"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="doctor">
                <Form.Label>Assign Doctor</Form.Label>
                <Form.Select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                >
                  <option value="">Select doctor</option>
                  {dummyDoctors.map((doc) => (
                    <option key={doc.d_id} value={doc.d_id}>
                      Dr. {doc.specialization}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mt-3" controlId="tests">
                <Form.Label>Required Tests</Form.Label>
                <Form.Select multiple name="tests" onChange={handleTestSelect}>
                  {dummyTests.map((test) => (
                    <option key={test.t_id} value={test.t_id}>
                      {test.test_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="room">
                <Form.Label>Assign Room</Form.Label>
                <Form.Select id="emergencyRoomSelect" required>
                  <option value="">Select room</option>
                  {rooms.map((room) => (
                    <option key={room.r_id} value={room.r_id}>
                      Room #{room.r_id}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={handleClear}
              type="button"
            >
              Clear
            </Button>
            <Button variant="danger" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    size="sm"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="ms-2">Processing...</span>
                </>
              ) : (
                <>
                  <FaExclamationTriangle className="me-2" />
                  Emergency Admission
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EmergencyAdmission;
