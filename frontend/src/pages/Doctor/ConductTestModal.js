import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/Modal.css";

const ConductTestModal = ({ appointment, d_id, onClose, onSubmitSuccess }) => {
  const [selectedTests, setSelectedTests] = useState([]);
  const loadTests = async (inputValue) => {
    try {
      const res = await axios.get(
        `/api/doctors/search/test?query=${inputValue}`
      );
      return res.data.map((test) => ({
        label: test.test_name,
        value: test.id,
      }));
    } catch (error) {
      console.error("Error loading tests:", error);
      return [];
    }
  };

  const handleSubmit = async () => {
    if (selectedTests.length === 0) {
      toast.error("Please select at least one test");
      return;
    }

    try {
      const testIds = selectedTests.map((t) => t.value);
      await axios.post(`/api/doctors/${appointment.app_id}/conducttest`, {
        tests: testIds,
      });
      toast.success("Tests scheduled successfully");
      setTimeout(() => {
        onSubmitSuccess();
      }, 1000);
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.error;
      toast.error(msg || "Failed to schedule tests");
    }
  };

  return (
    <div className="custom-modal">
      <div className="custom-modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h4 className="mb-3">
          Conduct Test for <strong>{appointment?.patient_name}</strong>
        </h4>

        <Form.Group className="mb-3">
          <Form.Label>Select Tests</Form.Label>
          <AsyncSelect
            isMulti
            cacheOptions
            defaultOptions
            loadOptions={loadTests}
            onChange={setSelectedTests}
            placeholder="Search and select tests..."
          />
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConductTestModal;
