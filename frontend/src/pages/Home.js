import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaSignInAlt, FaArrowRight } from "react-icons/fa";
import styles from "../styles/home-styles.module.css";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  const goToDashboard = () => {
    if (!user) return;
    if (user.role === "Doctor") {
      navigate(`/doctor`);
    } else if (user.role === "FrontDesk") {
      navigate(`/frontdesk`);
    } else if (user.role === "Admin") {
      navigate(`/admin`);
    } else if (user.role === "Nurse") {
      navigate(`/nurse`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className={styles.wrapper}>
      <Container className="text-center">
        <h1 className={styles.heading}>
          Welcome to the{" "}
          <span className={styles.highlight}>Hospital Management System</span>
        </h1>

        {user ? (
          <>
            <h4 className={styles.greeting}>
              Hello, <span className={styles.userName}>{user.name}</span> 👋
            </h4>
            <Row className="justify-content-center">
              <Col md={6} lg={4} className="d-flex justify-content-center">
                <Card className={styles.cardBox}>
                  <Card.Body className="py-4">
                    <FaArrowRight
                      size={50}
                      className={`text-primary ${styles.icon}`}
                    />
                    <Card.Title className="fw-semibold fs-4 mb-2">
                      Go to Dashboard
                    </Card.Title>
                    <Card.Text className="text-muted mb-4">
                      Continue managing your responsibilities
                    </Card.Text>
                    <Button
                      variant="primary"
                      className={styles.btnRounded}
                      onClick={goToDashboard}
                    >
                      Open Dashboard
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <Row className="justify-content-center">
            <Col md={6} lg={4} className="d-flex justify-content-center">
              <Card className={styles.cardBox}>
                <Card.Body className="py-4 d-flex flex-column align-items-center">
                  <FaSignInAlt
                    size={50}
                    className={`text-success mb-3 ${styles.icon}`}
                  />
                  <Card.Title className="fw-semibold fs-4 mb-2 text-center">
                    Login
                  </Card.Title>
                  <Card.Text className="text-muted mb-4 text-center">
                    Please log in to access your dashboard and features.
                  </Card.Text>
                  <Button
                    variant="success"
                    className={`${styles.btnRounded} px-4`}
                    onClick={() => navigate("/login")}
                  >
                    Login Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
