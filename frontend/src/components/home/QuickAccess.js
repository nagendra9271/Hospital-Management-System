// components/home/QuickAccess.jsx
import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUserInjured,
  FaChartLine,
  FaBed,
  FaClipboardList,
  FaCog,
  FaUserMd,
  FaFileMedical,
  FaFlask,
} from "react-icons/fa";

const QuickAccess = ({ user }) => {
  const navigate = useNavigate();

  // Define quick access items based on user role
  const getQuickAccessItems = () => {
    const commonItems = [
      {
        icon: <FaCalendarAlt />,
        title: "Appointments",
        path: "/appointments",
        color: "#4e73df",
      },
      {
        icon: <FaUserInjured />,
        title: "Patients",
        path: "/patients",
        color: "#1cc88a",
      },
    ];

    switch (user.role) {
      case "Doctor":
        return [
          ...commonItems,
          {
            icon: <FaClipboardList />,
            title: "My Schedule",
            path: "/doctor/schedule",
            color: "#36b9cc",
          },
          {
            icon: <FaFileMedical />,
            title: "Treatments",
            path: "/treatments",
            color: "#f6c23e",
          },
          {
            icon: <FaFlask />,
            title: "Lab Results",
            path: "/lab-results",
            color: "#e74a3b",
          },
          {
            icon: <FaChartLine />,
            title: "Analytics",
            path: "/analytics",
            color: "#6f42c1",
          },
        ];
      case "Admin":
        return [
          ...commonItems,
          {
            icon: <FaUserMd />,
            title: "Staff",
            path: "/staff",
            color: "#36b9cc",
          },
          {
            icon: <FaBed />,
            title: "Rooms",
            path: "/rooms",
            color: "#f6c23e",
          },
          {
            icon: <FaChartLine />,
            title: "Reports",
            path: "/reports",
            color: "#e74a3b",
          },
          {
            icon: <FaCog />,
            title: "Settings",
            path: "/settings",
            color: "#6f42c1",
          },
        ];
      default:
        return [
          ...commonItems,
          {
            icon: <FaBed />,
            title: "Rooms",
            path: "/rooms",
            color: "#36b9cc",
          },
          {
            icon: <FaFileMedical />,
            title: "Records",
            path: "/records",
            color: "#f6c23e",
          },
        ];
    }
  };

  const quickAccessItems = getQuickAccessItems();

  return (
    <div className="quick-access-section">
      <h2 className="section-title">Quick Access</h2>

      <Row className="g-4">
        {quickAccessItems.map((item, index) => (
          <Col xs={6} sm={4} md={3} xl={2} key={index}>
            <Card
              className="quick-access-card"
              onClick={() => navigate(item.path)}
              style={{ borderTopColor: item.color }}
            >
              <Card.Body>
                <div
                  className="quick-access-icon"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <h5 className="quick-access-title">{item.title}</h5>
              </Card.Body>
              <div className="card-hover-effect"></div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default QuickAccess;
