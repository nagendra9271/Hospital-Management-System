import React, { useState } from "react";
import "../../styles/Modal.css"; // Customize or reuse your existing modal CSS
import { Button, Form } from "react-bootstrap";

const PrescriptionModal = ({ appointment, onClose, onSubmit }) => {
  const [description, setDescription] = useState("");
  const [prescription, setPrescription] = useState("");

  const handleSubmit = () => {
    if (!description || !prescription) {
      alert("Please fill in all fields.");
      return;
    }
    onSubmit({ app_id: appointment.app_id, description, prescription });
    onClose();
  };

  return (
    <div className="custom-modal">
      <div className="custom-modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h4 className="mb-3">
          Prescription for{" "}
          <strong>{appointment?.patient_name || appointment?.p_id}</strong>
        </h4>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter diagnosis, symptoms, etc."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Prescription</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter medicines and instructions"
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
