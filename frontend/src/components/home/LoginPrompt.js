// components/home/LoginPrompt.jsx
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const LoginPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="login-prompt-section">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="login-card">
              <Card.Body>
                <Row>
                  <Col md={7} className="login-content">
                    <h2 className="login-title">Ready to get started?</h2>
                    <p className="login-subtitle">
                      Access your dashboard to manage patients, appointments,
                      and hospital resources all in one place.
                    </p>
                    <div className="login-actions">
                      <Button
                        variant="primary"
                        size="lg"
                        className="login-btn"
                        onClick={() => navigate("/login")}
                      >
                        <FaSignInAlt className="me-2" /> Log In
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="lg"
                        className="contact-btn"
                        onClick={() => navigate("/contact")}
                      >
                        <FaUserPlus className="me-2" /> Request Access
                      </Button>
                    </div>
                  </Col>
                  <Col md={5} className="login-decoration">
                    <div className="decoration-circle"></div>
                    <div className="decoration-pattern"></div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPrompt;
