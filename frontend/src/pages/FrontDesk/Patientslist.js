import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, InputGroup, FormControl, Container } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`/api/patients?search=${search}`);
      setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search]);

  return (
    <Container className="my-4">
      <h3 className="mb-4">Patient List</h3>

      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <FormControl
          placeholder="Search by name, email, phone, or blood group"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Blood Group</th>
            <th>Address</th>
            <th>Registered On</th>
          </tr>
        </thead>
        <tbody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.email}</td>
                <td>{patient.phone}</td>
                <td>{patient.bloodgroup}</td>
                <td>{patient.address}</td>
                <td>{new Date(patient.CreatedAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No patients found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
