import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  Button,
  Form,
  Spinner,
  Badge,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from "../context/authContext";
import EditUserModal from "../components/EditUserModal";
import {
  FaUserMd,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaBriefcase,
  FaStethoscope,
  FaKey,
  FaEdit,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaCalendarAlt,
} from "react-icons/fa";

const ProfilePage = () => {
  const { user: userDetails, loading: authLoading } = useAuth();
  const isDoctor = userDetails?.role === "Doctor";
  const [activeTab, setActiveTab] = useState("personal");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Set user from userDetails
  useEffect(() => {
    if (userDetails) {
      setUser(userDetails);
    }
  }, [userDetails]);

  // Fetch doctor details and stats if role is Doctor
  useEffect(() => {
    const fetchData = async () => {
      if (!userDetails?.user_id) {
        setLoading(false);
        return;
      }

      try {
        if (userDetails.role === "Doctor") {
          // Fetch doctor details
          const doctorResponse = await axios.get(
            `/api/doctors/${userDetails.user_id}`
          );
          setUser((prevUser) => ({
            ...prevUser,
            ...doctorResponse.data.doctor,
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails]);

  const handlePasswordChange = async () => {
    if (newPassword.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await axios.post(
        `/api/admin/changepassword/${user.user_id}`,
        {
          new: newPassword,
        }
      );

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsCurrentPasswordValid(false);
      setActiveTab("personal");
    } catch (error) {
      console.error("Password update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await axios.put(
        `/api/admin/${isDoctor ? "doctors" : "staff"}/${user.user_id}`,
        updatedData
      );
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);

      // Update local state after successful API call
      setUser((prev) => ({
        ...prev,
        ...updatedData,
        phone_no: updatedData.phone,
      }));
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    }
  };

  const validateCurrentPassword = async () => {
    try {
      const res = await axios.post(
        `/api/admin/verifypassword/${user.user_id}`,
        {
          old: currentPassword,
        }
      );
      if (res.status === 200) {
        setIsCurrentPasswordValid(true);
        toast.success("Password verified. You can now change it.");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Incorrect password. Try again.";
      toast.error(msg);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "Doctor":
        return "primary";
      case "Admin":
        return "danger";
      case "FrontEntry":
        return "success";
      case "Nurse":
        return "info";
      default:
        return "secondary";
    }
  };

  if (authLoading || loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading your profile...</p>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="text-center mt-5">
        <div className="alert alert-warning">
          <h4>No user data available</h4>
          <p>
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="py-4 px-4 bg-light"
      style={{ marginTop: "60px", minHeight: "90vh" }}
    >
      <ToastContainer position="top-right" autoClose={2000} />

      <Row>
        {/* Profile Sidebar */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow rounded-4 overflow-hidden">
            <div className="bg-primary text-white p-4 text-center">
              <div className="d-flex justify-content-center">
                <div
                  className="rounded-circle bg-white d-flex justify-content-center align-items-center"
                  style={{
                    width: "120px",
                    height: "120px",
                    overflow: "hidden",
                  }}
                >
                  {isDoctor ? (
                    <FaUserMd
                      className="text-primary"
                      style={{ fontSize: "60px" }}
                    />
                  ) : (
                    <FaUser
                      className="text-primary"
                      style={{ fontSize: "60px" }}
                    />
                  )}
                </div>
              </div>
              <h3 className="mt-3 mb-1">{user.name}</h3>
              <Badge
                bg={getRoleBadgeVariant(user.role)}
                className="px-3 py-2 rounded-pill"
              >
                {user.role}
              </Badge>
            </div>

            <Card.Body className="p-4">
              <div className="d-grid gap-3">
                <div className="d-flex align-items-center">
                  <div className="me-3 text-primary">
                    <FaEnvelope size={18} />
                  </div>
                  <div>
                    <div className="text-muted small">Email</div>
                    <div>{user.email}</div>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="me-3 text-primary">
                    <FaPhone size={18} />
                  </div>
                  <div>
                    <div className="text-muted small">Phone</div>
                    <div>{user.phone_no || "Not specified"}</div>
                  </div>
                </div>

                {isDoctor && (
                  <>
                    <div className="d-flex align-items-center">
                      <div className="me-3 text-primary">
                        <FaStethoscope size={18} />
                      </div>
                      <div>
                        <div className="text-muted small">Specialization</div>
                        <div>{user.specialization}</div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="me-3 text-primary">
                        <FaUniversity size={18} />
                      </div>
                      <div>
                        <div className="text-muted small">Degree</div>
                        <div>{user.degree}</div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="me-3 text-primary">
                        <FaBriefcase size={18} />
                      </div>
                      <div>
                        <div className="text-muted small">Experience</div>
                        <div>{user.experience} years</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Button
                variant="outline-primary"
                className="w-100 mt-4"
                onClick={() => setIsEditModalOpen(true)}
              >
                <FaEdit className="me-2" /> Edit Profile
              </Button>
            </Card.Body>
          </Card>

          {/* Stats Card
          <Card className="border-0 shadow rounded-4 mt-4">
            <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
              <h5 className="mb-0">Statistics</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col xs={4} className="text-center">
                  <div className="p-3">
                    <h4 className="text-primary mb-1">{stats.appointments}</h4>
                    <div className="small text-muted">Appointments</div>
                  </div>
                </Col>
                <Col xs={4} className="text-center border-start border-end">
                  <div className="p-3">
                    <h4 className="text-success mb-1">{stats.patients}</h4>
                    <div className="small text-muted">Patients</div>
                  </div>
                </Col>
                <Col xs={4} className="text-center">
                  <div className="p-3">
                    <h4 className="text-info mb-1">{stats.tests}</h4>
                    <div className="small text-muted">Tests</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card> */}
        </Col>

        {/* Main Content */}
        <Col lg={8}>
          <Card className="border-0 shadow rounded-4">
            <Card.Header className="bg-white border-0 p-4 pb-0">
              <Nav
                variant="tabs"
                className="border-bottom-0"
                activeKey={activeTab}
                onSelect={setActiveTab}
              >
                <Nav.Item>
                  <Nav.Link eventKey="personal" className="px-4 py-3">
                    <FaUser className="me-2" /> Personal Details
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="security" className="px-4 py-3">
                    <FaShieldAlt className="me-2" /> Security
                  </Nav.Link>
                </Nav.Item>
                {isDoctor && (
                  <Nav.Item>
                    <Nav.Link eventKey="schedule" className="px-4 py-3">
                      <FaCalendarAlt className="me-2" /> Schedule
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
            </Card.Header>
            <Card.Body className="p-4">
              {activeTab === "personal" && (
                <div>
                  <h5 className="mb-4">Personal Information</h5>
                  <Row className="mb-4">
                    <Col md={6} className="mb-3">
                      <div className="text-muted mb-1 small">Full Name</div>
                      <div className="form-control-plaintext border rounded p-2">
                        {user.name}
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <div className="text-muted mb-1 small">Email Address</div>
                      <div className="form-control-plaintext border rounded p-2">
                        {user.email}
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <div className="text-muted mb-1 small">Phone Number</div>
                      <div className="form-control-plaintext border rounded p-2">
                        {user.phone_no || "Not specified"}
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <div className="text-muted mb-1 small">Role</div>
                      <div className="form-control-plaintext border rounded p-2">
                        {user.role}
                      </div>
                    </Col>
                  </Row>

                  {isDoctor && (
                    <>
                      <h5 className="mb-4 mt-5">Professional Information</h5>
                      <Row>
                        <Col md={6} className="mb-3">
                          <div className="text-muted mb-1 small">
                            Specialization
                          </div>
                          <div className="form-control-plaintext border rounded p-2">
                            {user.specialization}
                          </div>
                        </Col>
                        <Col md={6} className="mb-3">
                          <div className="text-muted mb-1 small">Degree</div>
                          <div className="form-control-plaintext border rounded p-2">
                            {user.degree}
                          </div>
                        </Col>
                        <Col md={6} className="mb-3">
                          <div className="text-muted mb-1 small">
                            Experience
                          </div>
                          <div className="form-control-plaintext border rounded p-2">
                            {user.experience} years
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <h5 className="mb-4">Password Management</h5>
                  <Form>
                    {/* Current Password + Eye + Verify Button */}
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Group controlId="formCurrentPassword">
                          <Form.Label>Current Password</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light">
                              {/* <FaKey /> */}
                            </span>
                            <Form.Control
                              type={showCurrentPassword ? "text" : "password"}
                              value={currentPassword}
                              placeholder="Enter current password"
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                setShowCurrentPassword((prev) => !prev)
                              }
                              tabIndex={-1}
                            >
                              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                            <Button
                              variant="dark"
                              className="px-4"
                              onClick={validateCurrentPassword}
                              disabled={!currentPassword}
                            >
                              Verify
                            </Button>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* New Password Section (only if current is valid) */}
                    {isCurrentPasswordValid && (
                      <>
                        <Row className="mb-3">
                          <Col md={6} className="mb-3">
                            <Form.Group controlId="formNewPassword">
                              <Form.Label>New Password</Form.Label>
                              <div className="input-group">
                                <span className="input-group-text bg-light">
                                  <FaKey />
                                </span>
                                <Form.Control
                                  type="password"
                                  value={newPassword}
                                  placeholder="Enter new password"
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                />
                              </div>
                              <Form.Text className="text-muted">
                                Password must be at least 6 characters
                              </Form.Text>
                            </Form.Group>
                          </Col>
                          <Col md={6} className="mb-3">
                            <Form.Group controlId="formConfirmPassword">
                              <Form.Label>Confirm Password</Form.Label>
                              <div className="input-group">
                                <span className="input-group-text bg-light">
                                  <FaKey />
                                </span>
                                <Form.Control
                                  type="password"
                                  value={confirmPassword}
                                  placeholder="Confirm new password"
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                />
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Button
                          variant="primary"
                          onClick={handlePasswordChange}
                          disabled={!newPassword || !confirmPassword}
                        >
                          Update Password
                        </Button>
                      </>
                    )}
                  </Form>

                  <hr className="my-4" />

                  <h5 className="mb-3">Account Security</h5>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Last Password Change</span>
                      <Badge bg="success">2 months ago</Badge>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="alert alert-info mt-4">
                    <div className="d-flex">
                      <div className="me-3">
                        <FaShieldAlt size={24} />
                      </div>
                      <div>
                        <h6 className="mb-1">Security recommendations</h6>
                        <p className="mb-0 small">
                          For better security, change your password every 3
                          months and use a combination of letters, numbers, and
                          special characters.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "schedule" && (
                <div>
                  <h5 className="mb-4">Work Schedule</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Day</th>
                          <th>Morning</th>
                          <th>Afternoon</th>
                          <th>Evening</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Monday</td>
                          <td className="bg-success bg-opacity-10">
                            9:00 - 12:00
                          </td>
                          <td className="bg-success bg-opacity-10">
                            2:00 - 5:00
                          </td>
                          <td className="bg-light text-muted">Off</td>
                        </tr>
                        <tr>
                          <td>Tuesday</td>
                          <td className="bg-success bg-opacity-10">
                            9:00 - 12:00
                          </td>
                          <td className="bg-light text-muted">Off</td>
                          <td className="bg-success bg-opacity-10">
                            6:00 - 9:00
                          </td>
                        </tr>
                        <tr>
                          <td>Wednesday</td>
                          <td className="bg-light text-muted">Off</td>
                          <td className="bg-success bg-opacity-10">
                            2:00 - 5:00
                          </td>
                          <td className="bg-success bg-opacity-10">
                            6:00 - 9:00
                          </td>
                        </tr>
                        <tr>
                          <td>Thursday</td>
                          <td className="bg-success bg-opacity-10">
                            9:00 - 12:00
                          </td>
                          <td className="bg-success bg-opacity-10">
                            2:00 - 5:00
                          </td>
                          <td className="bg-light text-muted">Off</td>
                        </tr>
                        <tr>
                          <td>Friday</td>
                          <td className="bg-success bg-opacity-10">
                            9:00 - 12:00
                          </td>
                          <td className="bg-success bg-opacity-10">
                            2:00 - 5:00
                          </td>
                          <td className="bg-light text-muted">Off</td>
                        </tr>
                        <tr>
                          <td>Saturday</td>
                          <td className="bg-light text-muted">Off</td>
                          <td className="bg-light text-muted">Off</td>
                          <td className="bg-success bg-opacity-10">
                            6:00 - 9:00
                          </td>
                        </tr>
                        <tr>
                          <td>Sunday</td>
                          <td className="bg-light text-muted" colSpan="3">
                            Off
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <Button variant="outline-primary">
                      <FaEdit className="me-2" /> Edit Schedule
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <EditUserModal
        show={isEditModalOpen}
        onHide={() => setIsEditModalOpen(false)}
        userData={user}
        showPassword={false}
        onSave={handleSaveEdit}
        role={user.role}
      />
    </Container>
  );
};

export default ProfilePage;
