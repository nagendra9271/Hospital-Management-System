// components/home/HeroSection.jsx
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat, FaArrowRight } from "react-icons/fa";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="hero-content">
            <div className="logo-container">
              <FaHeartbeat className="hero-logo" />
              <span className="logo-text">HMS</span>
            </div>
            <h1 className="hero-title">
              Hospital Management
              <br />
              <span className="gradient-text">At Your Fingertips</span>
            </h1>
            <p className="hero-subtitle">
              Streamline your healthcare operations with our comprehensive
              hospital management solution. Efficient. Secure. Reliable.
            </p>
            <div className="hero-actions">
              <Button
                variant="primary"
                size="lg"
                className="btn-action"
                onClick={() => navigate("/login")}
              >
                Get Started <FaArrowRight className="ms-2" />
              </Button>
              <Button
                variant="outline-secondary"
                size="lg"
                className="btn-learn-more"
                onClick={() => navigate("/about")}
              >
                Learn More
              </Button>
            </div>
          </Col>
          <Col lg={6} className="hero-image-container">
            <div className="hero-image"></div>
            <div className="hero-shape-1"></div>
            <div className="hero-shape-2"></div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
