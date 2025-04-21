import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", data);
      toast.success("Signup successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.error || "Signup failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card p-4 shadow-lg"
        style={{ width: "400px" }}
      >
        <h2 className="text-center mb-4">Staff Signup</h2>

        <div className="form-floating mb-3">
          <input
            {...register("name", { required: "Name is required" })}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="Name"
          />
          <label>Name</label>
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>

        <div className="form-floating mb-3">
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="Email"
          />
          <label>Email</label>
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        <div className="form-floating mb-3">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Password"
          />
          <label>Password</label>
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>

        <div className="form-floating mb-3">
          <input
            {...register("phone_no", {
              required: "Phone number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Phone must be 10 digits",
              },
            })}
            className={`form-control ${errors.phone_no ? "is-invalid" : ""}`}
            placeholder="Phone Number"
          />
          <label>Phone Number</label>
          {errors.phone_no && (
            <div className="invalid-feedback">{errors.phone_no.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className={`form-select ${errors.role ? "is-invalid" : ""}`}
            {...register("role", { required: "Role is required" })}
          >
            <option value="">Select Role</option>
            <option value="FrontDesk">Front Desk</option>
            <option value="Doctor">Doctor</option>
            <option value="DataEntry">Data Entry</option>
            <option value="Admin">Admin</option>
          </select>
          {errors.role && (
            <div className="invalid-feedback">{errors.role.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Signup"}
        </button>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/login" className="fw-bold text-primary">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
