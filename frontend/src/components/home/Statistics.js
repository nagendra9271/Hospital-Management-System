// components/home/Statistics.jsx
import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import {
  FaUserInjured,
  FaCalendarCheck,
  FaBed,
  FaUserMd,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const Statistics = ({ user }) => {
  // Mock statistics data - this would come from your API in real implementation
  const stats = {
    totalPatients: 1458,
    patientsTrend: 12.4,
    todayAppointments: 24,
    appointmentsTrend: -3.6,
    occupiedRooms: 42,
    occupancyRate: 78,
    activeStaff: 36,
    onDutyRate: 90,
  };

  // Only show staff stats for admin
  const showStaffStats = user.role === "Admin";

  return (
    <div className="statistics-section mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">Dashboard Statistics</h2>
        <div className="stats-date">
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      <Row className="g-4">
        <Col lg={3} sm={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon patients">
                <FaUserInjured />
              </div>
              <div className="stat-info">
                <h3 className="stat-title">Total Patients</h3>
                <div className="stat-value">{stats.totalPatients}</div>
                <div className="stat-trend positive">
                  <FaArrowUp />
                  <span>{stats.patientsTrend}%</span> from last month
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} sm={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon appointments">
                <FaCalendarCheck />
              </div>
              <div className="stat-info">
                <h3 className="stat-title">Today's Appointments</h3>
                <div className="stat-value">{stats.todayAppointments}</div>
                <div className="stat-trend negative">
                  <FaArrowDown />
                  <span>{Math.abs(stats.appointmentsTrend)}%</span> from
                  yesterday
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} sm={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon rooms">
                <FaBed />
              </div>
              <div className="stat-info">
                <h3 className="stat-title">Room Occupancy</h3>
                <div className="stat-value">{stats.occupiedRooms}</div>
                <div className="stat-occupancy">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${stats.occupancyRate}%` }}
                      aria-valuenow={stats.occupancyRate}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <span>{stats.occupancyRate}% occupancy rate</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {showStaffStats && (
          <Col lg={3} sm={6}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon staff">
                  <FaUserMd />
                </div>
                <div className="stat-info">
                  <h3 className="stat-title">Active Staff</h3>
                  <div className="stat-value">{stats.activeStaff}</div>
                  <div className="stat-occupancy">
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${stats.onDutyRate}%` }}
                        aria-valuenow={stats.onDutyRate}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span>{stats.onDutyRate}% on duty now</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Statistics;
