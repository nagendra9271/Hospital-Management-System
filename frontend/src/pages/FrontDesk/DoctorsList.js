import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Spinner, Alert, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Function to fetch doctors data with optional search query
  const getDoctors = async (searchTerm) => {
    setLoading(true);
    try {
      // Pass the search term as a query parameter to the API
      const res = await axios.get("/api/doctors", {
        params: { search: searchTerm },
      });
      setDoctors(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch doctors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors on component mount and when searchQuery changes.
  useEffect(() => {
    getDoctors(searchQuery);
  }, [searchQuery]);

  // Event handler for search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    // Update the URL parameter - if input is empty, clear the query parameter
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Doctor List</h2>

      {/* Search Input */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search doctors by name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Form.Group>

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th>Degree</th>
              <th>Experience (yrs)</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc, index) => (
              <tr key={doc.id}>
                <td>{index + 1}</td>
                <td>{doc.name}</td>
                <td>{doc.email}</td>
                <td>{doc.phone}</td>
                <td>{doc.specialization}</td>
                <td>{doc.degree}</td>
                <td>{doc.experience}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
