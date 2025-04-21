// components/home/FeatureCards.jsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaUserMd,
  FaCalendarCheck,
  FaClipboardList,
  FaBed,
  FaFlask,
  FaLock,
} from "react-icons/fa";

const FeatureCards = () => {
  const features = [
    {
      icon: <FaUserMd />,
      title: "Doctor Management",
      description:
        "Efficiently manage doctor schedules, specializations, and appointments",
    },
    {
      icon: <FaCalendarCheck />,
      title: "Appointment System",
      description:
        "Easy booking, rescheduling and cancellation of patient appointments",
    },
    {
      icon: <FaClipboardList />,
      title: "Patient Records",
      description:
        "Secure digital storage of patient history, treatments and reports",
    },
    {
      icon: <FaBed />,
      title: "Room Management",
      description:
        "Track room availability, assignments and maintenance status",
    },
    {
      icon: <FaFlask />,
      title: "Lab Tests",
      description:
        "Order tests, track results and maintain comprehensive records",
    },
    {
      icon: <FaLock />,
      title: "Secure Access",
      description:
        "Role-based access control ensures data security and privacy",
    },
  ];

  return (
    <div className="features-section">
      <Container>
        <h2 className="section-title text-center">Comprehensive Features</h2>
        <p className="section-subtitle text-center">
          Everything you need to streamline hospital operations
        </p>

        <Row className="g-4 mt-3">
          {features.map((feature, index) => (
            <Col md={6} lg={4} key={index}>
              <Card className="feature-card h-100">
                <Card.Body>
                  <div className="feature-icon">{feature.icon}</div>
                  <Card.Title className="feature-title">
                    {feature.title}
                  </Card.Title>
                  <Card.Text className="feature-description">
                    {feature.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default FeatureCards;
