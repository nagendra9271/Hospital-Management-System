import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import AsyncSelect from "react-select/async";
import { useAuth } from "../../context/authContext";
import "react-toastify/dist/ReactToastify.css";

export default function Appointment() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [patientOptions, setPatientOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);

  const today = new Date(Date.now() + 5.5 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const loadPatientOptions = async (inputValue) => {
    try {
      const res = await axios.get(`/api/patients/search?query=${inputValue}`);
      const options = res.data.map((p) => ({ label: p.name, value: p.id }));
      return options;
    } catch (err) {
      console.error("Error fetching patients", err);
      return [];
    }
  };

  const loadDoctorOptions = async (inputValue) => {
    try {
      const res = await axios.get(`/api/doctors/search?query=${inputValue}`);
      const options = res.data.map((d) => ({ label: d.name, value: d.id }));
      return options;
    } catch (err) {
      console.error("Error fetching doctors", err);
      return [];
    }
  };

  async function onSubmit(data) {
    if (!user) {
      toast.error("User not logged in.");
      return;
    }

    const formData = {
      patientId: data.patient?.value,
      doctorId: data.doctor?.value,
      date: data.date,
      priority: data.priority,
      symptoms: data.symptoms,
      status: "Scheduled", // default
    };

    setLoading(true);
    try {
      await axios.post("/api/appointments/book", formData);
      reset({
        patient: null,
        doctor: null,
        date: "",
        priority: "",
        symptoms: "",
      });
      toast.success("Appointment booked successfully!");
    } catch (err) {
      const msg = err.response?.data?.error || "Booking failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return <p className="text-center mt-4">Loading user...</p>;

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 className="mb-4 text-center">Book an Appointment</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card p-4 shadow-sm mx-auto"
        style={{ maxWidth: "500px" }}
      >
        {/* Patient Name */}
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
                defaultOptions={patientOptions}
                onFocus={async () => {
                  const options = await loadPatientOptions("");
                  setPatientOptions(options);
                }}
                placeholder="Search patient..."
              />
            )}
          />
          {errors.patient && (
            <div className="text-danger">{errors.patient.message}</div>
          )}
        </div>

        {/* Doctor Name */}
        <div className="mb-3">
          <label className="form-label">Doctor Name</label>
          <Controller
            name="doctor"
            control={control}
            rules={{ required: "Doctor is required" }}
            render={({ field }) => (
              <AsyncSelect
                {...field}
                cacheOptions
                loadOptions={loadDoctorOptions}
                defaultOptions={doctorOptions}
                onFocus={async () => {
                  const options = await loadDoctorOptions("");
                  setDoctorOptions(options);
                }}
                placeholder="Search doctor..."
              />
            )}
          />
          {errors.doctor && (
            <div className="text-danger">{errors.doctor.message}</div>
          )}
        </div>

        {/* Appointment Date */}
        <div className="mb-3">
          <label className="form-label">Appointment Date</label>
          <input
            type="date"
            min={today}
            className={`form-control ${errors.date ? "is-invalid" : ""}`}
            {...register("date", {
              required: "Date is required",
              validate: (value) =>
                value >= today || "Appointment date cannot be in the past",
            })}
          />
          {errors.date && (
            <div className="invalid-feedback">{errors.date.message}</div>
          )}
        </div>

        {/* Priority */}
        <div className="mb-3">
          <label className="form-label">Priority</label>
          <select
            className={`form-select ${errors.priority ? "is-invalid" : ""}`}
            {...register("priority", { required: "Priority is required" })}
          >
            <option value="">-- Select Priority --</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && (
            <div className="invalid-feedback">{errors.priority.message}</div>
          )}
        </div>

        {/* Symptoms */}
        <div className="mb-3">
          <label className="form-label">Symptoms</label>
          <textarea
            className={`form-control ${errors.symptoms ? "is-invalid" : ""}`}
            id="symptoms"
            placeholder="Symptoms / Reason for Appointment"
            style={{ height: "100px" }}
            {...register("symptoms", { required: "Symptoms are required" })}
          />
          {errors.symptoms && (
            <div className="invalid-feedback">{errors.symptoms.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}
