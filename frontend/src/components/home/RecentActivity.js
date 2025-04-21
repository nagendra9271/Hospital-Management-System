import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import { FaCalendarCheck, FaFlask, FaHospital, FaClock } from "react-icons/fa";

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "appointment":
        return <FaCalendarCheck className="activity-type-icon appointment" />;
      case "test":
        return <FaFlask className="activity-type-icon test" />;
      case "admission":
        return <FaHospital className="activity-type-icon admission" />;
      default:
        return <FaClock className="activity-type-icon" />;
    }
  };

  const getStatusBadge = (status) => {
    let variant = "secondary";

    switch (status) {
      case "scheduled":
        variant = "info";
        break;
      case "completed":
        variant = "success";
        break;
      case "active":
        variant = "primary";
        break;
      case "canceled":
        variant = "danger";
        break;
      default:
        variant = "secondary";
    }

    return <Badge bg={variant}>{status}</Badge>;
  };

  return (
    <Card className="recent-activity-card">
      <Card.Header>
        <h3>Recent Activity</h3>
      </Card.Header>
      {activities.length === 0 ? (
        <Card.Body>
          <p className="text-muted">No recent activities to display.</p>
        </Card.Body>
      ) : (
        <ListGroup variant="flush">
          {activities.map((activity) => (
            <ListGroup.Item key={activity.id} className="activity-item">
              <div className="activity-icon">
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <h4>{activity.title}</h4>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="activity-patient">{activity.patient}</p>
                <div className="activity-meta">
                  <span className="activity-time">
                    <FaClock className="me-1" />
                    {activity.time}
                  </span>
                  <span className="activity-date">{activity.date}</span>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <Card.Footer>
        <a href="#" className="view-all">
          View all activity
        </a>
      </Card.Footer>
    </Card>
  );
};

export default RecentActivity;
