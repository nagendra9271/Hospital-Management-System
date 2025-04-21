import React, { useEffect, useState } from "react";
import { Card, Table, Container } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure to import this once

const ManageRooms = () => {
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("/api/frontdesk/rooms");
      setRoomData(res.data || []);
    } catch (err) {
      toast.error("Failed to load room data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Container className="my-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="mb-4 text-center">Room Assignments</h4>

          {loading ? (
            <div className="text-center my-4">Loading rooms...</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Room Number</th>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Doctor Name</th>
                </tr>
              </thead>
              <tbody>
                {roomData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No room assignments found
                    </td>
                  </tr>
                ) : (
                  roomData.map((room, idx) => (
                    <tr key={idx}>
                      <td>{room.Room_no}</td>
                      <td>{room.PatientID}</td>
                      <td>{room.PatientName}</td>
                      <td>{room.Age}</td>
                      <td>{room.DoctorName}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManageRooms;
