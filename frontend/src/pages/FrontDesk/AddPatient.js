import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/authContext";
import Spinner from "../../components/Spinner";

export default function PatientForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth(); // get user info

  async function onSubmit(data) {
    if (!user) {
      toast.error("User not logged in.");
      return;
    }

    const formData = { ...data, createdBy: user.user_id };
    setLoading(true);
    try {
      await axios.post("/api/patients/add", formData);
      toast.success("Patient Registration Successful");

      reset();
    } catch (err) {
      console.log(err);
      const msg =
        err.response?.data?.error || "Registering Patient failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return <Spinner />;
  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2 className="mb-4 text-center">Patient Registration</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card p-4 shadow-sm mx-auto"
        style={{ maxWidth: "500px" }}
      >
        {/* Name */}
        <div className="form-floating mb-3">
          <input
            type="text"
            className={`form-control ${errors.Pname ? "is-invalid" : ""}`}
            id="Pname"
            placeholder="Patient Name"
            {...register("Pname", { required: "Patient name is required" })}
          />
          <label htmlFor="Pname">Name</label>
          {errors.Pname && (
            <div className="invalid-feedback">{errors.Pname.message}</div>
          )}
        </div>

        {/* Age */}
        <div className="form-floating mb-3">
          <input
            type="number"
            className={`form-control ${errors.Page ? "is-invalid" : ""}`}
            id="Page"
            placeholder="Age"
            {...register("Page", {
              required: "Age is required",
              min: { value: 0, message: "Invalid age" },
            })}
          />
          <label htmlFor="Page">Age</label>
          {errors.Page && (
            <div className="invalid-feedback">{errors.Page.message}</div>
          )}
        </div>

        {/* Address */}
        <div className="form-floating mb-3">
          <input
            type="text"
            className={`form-control ${errors.Paddress ? "is-invalid" : ""}`}
            id="Paddress"
            placeholder="Address"
            {...register("Paddress", { required: "Address is required" })}
          />
          <label htmlFor="Paddress">Address</label>
          {errors.Paddress && (
            <div className="invalid-feedback">{errors.Paddress.message}</div>
          )}
        </div>

        {/* Phone */}
        <div className="form-floating mb-3">
          <input
            type="tel"
            className={`form-control ${errors.Pphone ? "is-invalid" : ""}`}
            id="Pphone"
            placeholder="Phone"
            {...register("Pphone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit phone number",
              },
            })}
          />
          <label htmlFor="Pphone">Phone</label>
          {errors.Pphone && (
            <div className="invalid-feedback">{errors.Pphone.message}</div>
          )}
        </div>

        {/* Email */}
        <div className="form-floating mb-3">
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
          <label htmlFor="email">Email</label>
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        {/* Gender */}
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            className={`form-select ${errors.gender ? "is-invalid" : ""}`}
            {...register("gender", { required: "Gender is required" })}
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <div className="invalid-feedback">{errors.gender.message}</div>
          )}
        </div>

        {/* Blood Group */}
        <div className="mb-3">
          <label className="form-label">Blood Group</label>
          <select
            className={`form-select ${errors.bloodgroup ? "is-invalid" : ""}`}
            {...register("bloodgroup", { required: "Blood group is required" })}
          >
            <option value="">-- Select Blood Group --</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          {errors.bloodgroup && (
            <div className="invalid-feedback">{errors.bloodgroup.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Patient"}
        </button>
      </form>
    </div>
  );
}
