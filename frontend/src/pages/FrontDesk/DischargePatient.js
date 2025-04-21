import React, { useState, useEffect } from "react";
import { Button, Table, Spinner, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const DischargePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dischargingId, setDischargingId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("/api/frontdesk/availablepatients");
      setPatients(response.data || []);
    } catch (error) {
      toast.error("Failed to load admitted patients.");
    }
  };

  const handleDischarge = async (admissionId) => {
    setDischargingId(admissionId);
    setLoading(true);
    try {
      await axios.get(`/api/frontdesk/dischargepatient/${admissionId}`);

      setPatients((prev) =>
        prev.filter((patient) => patient.admissionId !== admissionId)
      );
      toast.success("Patient discharged successfully.");
    } catch (err) {
      toast.error("Failed to discharge patient.");
    } finally {
      setLoading(false);
      setDischargingId(null);
    }
  };

  return (
    <div className="p-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-4 text-center">🏥 Discharge Patients</h3>
          <Table
            striped
            bordered
            hover
            responsive
            className="text-center align-middle"
          >
            <thead className="table-dark">
              <tr>
                <th>Admission ID</th>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Room</th>
                <th>Admitted On</th>
                <th>Doctor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No patients currently admitted.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.admissionId}>
                    <td>{patient.admissionId}</td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.room}</td>
                    <td>
                      {new Date(patient.admittedOn).toLocaleDateString("en-GB")}
                    </td>

                    <td>{patient.doctor}</td>
                    <td>
                      <Button
                        variant="danger"
                        disabled={
                          loading && dischargingId === patient.admissionId
                        }
                        onClick={() => handleDischarge(patient.admissionId)}
                      >
                        {loading && dischargingId === patient.admissionId ? (
                          <>
                            <Spinner size="sm" animation="border" />{" "}
                            Discharging...
                          </>
                        ) : (
                          "Discharge"
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DischargePatients;
