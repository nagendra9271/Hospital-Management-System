import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

const PatientDataEntry = () => {
  const {
    register,
    handleSubmit,
    // setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);
  const [formData, setFormData] = useState({
    patient: null,
    doctor: null,
    test: null,
    testResult: "",
    entryDate: "",
    roomNo: "",
  });

  const [roomOccupied, setRoomOccupied] = useState(false);

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientRes = await axios.get("/api/patients/search");
        const doctorRes = await axios.get("/api/doctors/search");
        const testRes = await axios.get("/api/tests");

        setPatients(patientRes.data);
        setDoctors(doctorRes.data);
        setTests(testRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const handleDropdownChange = (selectedOption, key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: selectedOption,
    }));
  };

  const onSubmit = async (data) => {
    if (roomOccupied) {
      toast.error("Room is already occupied. Please choose another.");
      return;
    }

    const payload = {
      patientId: formData.patient.value,
      doctorId: formData.doctor.value,
      testId: formData.test.value,
      testResult: data.testResult,
      entryDate: data.entryDate,
      roomNo: data.roomNo,
    };

    try {
      await axios.post("/api/patient-data", payload);
      toast.success("Patient data saved successfully");
      reset();
      setFormData({
        patient: null,
        doctor: null,
        test: null,
        testResult: "",
        entryDate: "",
        roomNo: "",
      });
      setRoomOccupied(false);
    } catch (error) {
      console.error("Failed to submit", error);
      toast.error("Failed to save patient data");
    }
  };

  // Check if room is occupied on blur
  const checkRoomStatus = async (roomNo) => {
    try {
      const res = await axios.get(`/api/rooms/${roomNo}/status`);
      setRoomOccupied(res.data.occupied);
    } catch (err) {
      console.error("Error checking room status", err);
      toast.error("Failed to check room status");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Patient Data Entry</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
        {/* Patient */}
        <div className="col-md-6">
          <label>Patient</label>
          <Select
            value={formData.patient}
            onChange={(selected) => handleDropdownChange(selected, "patient")}
            options={patients.map((p) => ({
              value: p.id,
              label: p.name,
            }))}
            placeholder="Select patient"
          />
          {!formData.patient && (
            <p className="text-danger">Patient is required</p>
          )}
        </div>

        {/* Doctor */}
        <div className="col-md-6">
          <label>Doctor</label>
          <Select
            value={formData.doctor}
            onChange={(selected) => handleDropdownChange(selected, "doctor")}
            options={doctors.map((d) => ({
              value: d.id,
              label: d.name,
            }))}
            placeholder="Select doctor"
          />
          {!formData.doctor && (
            <p className="text-danger">Doctor is required</p>
          )}
        </div>

        {/* Test */}
        <div className="col-md-6">
          <label>Test</label>
          <Select
            value={formData.test}
            onChange={(selected) => handleDropdownChange(selected, "test")}
            options={tests.map((t) => ({
              value: t.id,
              label: t.name,
            }))}
            placeholder="Select test"
          />
          {!formData.test && <p className="text-danger">Test is required</p>}
        </div>

        {/* Test Result */}
        <div className="col-md-6">
          <label>Test Result</label>
          <input
            type="text"
            {...register("testResult", { required: "Test result is required" })}
            className="form-control"
            placeholder="Enter test result"
          />
          {errors.testResult && (
            <p className="text-danger">{errors.testResult.message}</p>
          )}
        </div>

        {/* Entry Date */}
        <div className="col-md-6">
          <label>Entry Date</label>
          <input
            type="date"
            {...register("entryDate", { required: "Entry date is required" })}
            className="form-control"
          />
          {errors.entryDate && (
            <p className="text-danger">{errors.entryDate.message}</p>
          )}
        </div>

        {/* Room Number */}
        <div className="col-md-6">
          <label>Room Number</label>
          <input
            type="number"
            {...register("roomNo", { required: "Room number is required" })}
            className={`form-control ${roomOccupied ? "is-invalid" : ""}`}
            onBlur={(e) => checkRoomStatus(e.target.value)}
            placeholder="Enter room number"
          />
          {errors.roomNo && (
            <p className="text-danger">{errors.roomNo.message}</p>
          )}
          {roomOccupied && (
            <p className="text-danger">Room already occupied.</p>
          )}
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Save Patient Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientDataEntry;
