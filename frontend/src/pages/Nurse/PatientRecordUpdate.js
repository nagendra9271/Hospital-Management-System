// src/Nurse/PatientRecordUpdate.js
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export default function PatientRecordUpdate() {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  // This function fetches the patient record and prepopulates the form
  useEffect(() => {
    async function fetchRecord() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/patient-data/record/${recordId}`);
        const record = res.data;
        // Set the current patient field using AsyncSelect's expected object shape
        setValue("patient", {
          value: record.patientId,
          label: record.patientName,
        });
        setValue("diagnosticTest", record.diagnosticTest);
        setValue("testResult", record.testResult);
        setValue("treatmentAdministered", record.treatmentAdministered);
        setValue("notes", record.notes);
        // Assume entryDate is stored in ISO format; set only the date part.
        setValue("entryDate", record.entryDate.split("T")[0]);
      } catch (err) {
        toast.error("Failed to load record.");
      } finally {
        setLoading(false);
      }
    }
    fetchRecord();
  }, [recordId, setValue]);

  // Function to load patient options for the async search input
  const loadPatientOptions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const res = await axios.get(`/api/patients/search?query=${inputValue}`);
      // Expect response in the format: [{ id, name }]
      return res.data.map((patient) => ({
        label: patient.name,
        value: patient.id,
      }));
    } catch (err) {
      console.error("Error fetching patients:", err);
      return [];
    }
  };

  async function onSubmit(data) {
    // Prepare data for submission; extract patientId from the async select field.
    const formData = {
      patientId: data.patient.value,
      diagnosticTest: data.diagnosticTest,
      testResult: data.testResult,
      treatmentAdministered: data.treatmentAdministered,
      notes: data.notes,
      entryDate: data.entryDate,
    };

    setLoading(true);
    try {
      await axios.put(`/api/patient-data/record/${recordId}`, formData);
      toast.success("Record updated successfully!");

      reset();
      navigate("/nurse/records/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Update failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Update Patient Record</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card p-4 shadow-sm mx-auto"
          style={{ maxWidth: "600px" }}
        >
          {/* Patient Selection with Async Search */}
          <div className="mb-3">
            <label className="form-label">Patient Name</label>
            <Controller
              name="patient"
              control={control}
              rules={{ required: "Patient is required" }}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  cacheOptions
                  loadOptions={loadPatientOptions}
                  defaultOptions
                  placeholder="Search for a patient..."
                />
              )}
            />
            {errors.patient && (
              <div className="text-danger">{errors.patient.message}</div>
            )}
          </div>

          {/* Diagnostic Test */}
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${
                errors.diagnosticTest ? "is-invalid" : ""
              }`}
              id="diagnosticTest"
              placeholder="Diagnostic Test"
              {...register("diagnosticTest", {
                required: "Diagnostic test is required",
              })}
            />
            <label htmlFor="diagnosticTest">Diagnostic Test</label>
            {errors.diagnosticTest && (
              <div className="invalid-feedback">
                {errors.diagnosticTest.message}
              </div>
            )}
          </div>

          {/* Test Result */}
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${
                errors.testResult ? "is-invalid" : ""
              }`}
              id="testResult"
              placeholder="Test Result"
              {...register("testResult", {
                required: "Test result is required",
              })}
            />
            <label htmlFor="testResult">Test Result</label>
            {errors.testResult && (
              <div className="invalid-feedback">
                {errors.testResult.message}
              </div>
            )}
          </div>

          {/* Treatment Administered */}
          <div className="form-floating mb-3">
            <textarea
              className={`form-control ${
                errors.treatmentAdministered ? "is-invalid" : ""
              }`}
              id="treatmentAdministered"
              placeholder="Treatment Administered"
              style={{ height: "120px" }}
              {...register("treatmentAdministered", {
                required: "Treatment details are required",
              })}
            />
            <label htmlFor="treatmentAdministered">
              Treatment Administered
            </label>
            {errors.treatmentAdministered && (
              <div className="invalid-feedback">
                {errors.treatmentAdministered.message}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              id="notes"
              placeholder="Additional Notes"
              style={{ height: "80px" }}
              {...register("notes")}
            />
            <label htmlFor="notes">Additional Notes</label>
          </div>

          {/* Entry Date */}
          <div className="form-floating mb-3">
            <input
              type="date"
              className={`form-control ${errors.entryDate ? "is-invalid" : ""}`}
              id="entryDate"
              {...register("entryDate", { required: "Entry date is required" })}
            />
            <label htmlFor="entryDate">Entry Date</label>
            {errors.entryDate && (
              <div className="invalid-feedback">{errors.entryDate.message}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Record"}
          </button>
        </form>
      )}
    </div>
  );
}
