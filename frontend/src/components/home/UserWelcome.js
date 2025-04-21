// components/home/UserWelcome.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaUserMd, FaUserCog, FaUserNurse, FaUser } from "react-icons/fa";

const UserWelcome = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case "Doctor":
        return <FaUserMd className="role-icon doctor" />;
      case "Admin":
        return <FaUserCog className="role-icon admin" />;
      case "Nurse":
        return <FaUserNurse className="role-icon nurse" />;
      default:
        return <FaUser className="role-icon" />;
    }
  };

  const getLastLogin = () => {
    // This would ideally come from your auth context or API
    return "Today at 08:45 AM";
  };

  return (
    <div className="welcome-banner">
      <Container fluid>
        <Row className="align-items-center welcome-content">
          <Col lg={7}>
            <div className="welcome-text">
              <h1 className="welcome-greeting">
                {getGreeting()},{" "}
                <span className="welcome-name">{user.name}</span>
              </h1>
              <p className="welcome-message">
                Welcome back to your Hospital Management Dashboard. Your last
                login was <strong>{getLastLogin()}</strong>
              </p>
            </div>
          </Col>
          <Col lg={5} className="d-flex justify-content-end">
            <div className="welcome-info">
              <div className="role-badge">
                {getRoleIcon()}
                <span className="role-name">{user.role}</span>
              </div>
              <div className="date-info">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserWelcome;
