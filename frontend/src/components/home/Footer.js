// components/home/Footer.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaHeartbeat,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-section">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <div className="footer-about">
              <div className="footer-logo">
                <FaHeartbeat className="footer-logo-icon" />
                <span>HMS</span>
              </div>
              <p className="footer-desc">
                Advanced hospital management system designed to optimize
                healthcare operations, improve patient care, and enhance
                administrative efficiency.
              </p>
            </div>
          </Col>

          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h5 className="footer-heading">Links</h5>
            <ul className="footer-links">
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/features">Features</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/help">Help Center</a>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5 className="footer-heading">Contact</h5>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt className="footer-icon" />
                <span>123 Healthcare Ave, Medical City</span>
              </li>
              <li>
                <FaPhone className="footer-icon" />
                <span>(123) 456-7890</span>
              </li>
              <li>
                <FaEnvelope className="footer-icon" />
                <span>support@hms-system.com</span>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="footer-heading">Working Hours</h5>
            <ul className="footer-hours">
              <li>
                <span className="day">Monday - Friday:</span>
                <span className="hours">8:00 AM - 6:00 PM</span>
              </li>
              <li>
                <span className="day">Saturday:</span>
                <span className="hours">9:00 AM - 4:00 PM</span>
              </li>
              <li>
                <span className="day">Sunday:</span>
                <span className="hours">Closed</span>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Hospital Management System. All
            rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
