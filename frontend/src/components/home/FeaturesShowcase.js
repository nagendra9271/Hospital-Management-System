import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaUserMd,
  FaCalendarAlt,
  FaChartLine,
  FaHospital,
  FaFileMedical,
  FaMobile,
} from "react-icons/fa";

const FeaturesShowcase = () => {
  const features = [
    {
      icon: <FaUserMd />,
      title: "Staff Management",
      description:
        "Efficiently manage doctors, nurses, and administrative staff profiles, schedules, and credentials.",
    },
    {
      icon: <FaCalendarAlt />,
      title: "Appointment Scheduling",
      description:
        "Streamline appointment booking, rescheduling, and cancellations with intelligent scheduling.",
    },
    {
      icon: <FaFileMedical />,
      title: "Patient Records",
      description:
        "Securely store and access complete patient medical histories, test results, and treatment plans.",
    },
    {
      icon: <FaHospital />,
      title: "Facility Management",
      description:
        "Track room occupancy, equipment status, and maintenance schedules across your facility.",
    },
    {
      icon: <FaChartLine />,
      title: "Advanced Analytics",
      description:
        "Gain valuable insights with comprehensive reports and dashboards to improve operational efficiency.",
    },
    {
      icon: <FaMobile />,
      title: "Mobile Access",
      description:
        "Access critical information on the go with responsive design that works on any device.",
    },
  ];

  return (
    <section className="features-showcase">
      <Container>
        <h2 className="text-center section-title">
          Comprehensive Healthcare Management
        </h2>
        <p className="text-center section-subtitle">
          Our Hospital Management System streamlines operations and enhances
          patient care
        </p>

        <Row className="mt-5">
          {features.map((feature, index) => (
            <Col lg={4} md={6} key={index} className="mb-4">
              <div className="feature-item">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturesShowcase;
