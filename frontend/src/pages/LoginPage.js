import React, { useState } from "react";
// import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // at the top with other imports

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await login(data);
      toast.success("Login successful!", { autoClose: 1000 });
      console.log(data);
      setTimeout(() => {
        switch (data.role) {
          case "Admin":
            navigate(`/admin`);
            break;
          case "Doctor":
            navigate("/doctor");
            break;
          case "Nurse":
            navigate(`/nurse`);
            break;
          case "Frontdesk":
            navigate(`/frontdesk`);
            break;
          default:
            navigate("/");
        }
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Login failed. Try again.";
      toast.error(errorMsg);
      setServerError(errorMsg); // optional: show both toast and inline error
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer position="top-right" autoClose={1000} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card p-4 shadow"
        style={{ width: "350px" }}
      >
        <h2 className="text-center mb-4">Hospital Login</h2>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        {/* Role */}
        <div className="mb-3">
          <label className="form-label">Login as:</label>
          <select
            className={`form-select ${errors.role ? "is-invalid" : ""}`}
            {...register("role", { required: "Role is required" })}
          >
            <option value="">-- Select Role --</option>
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Frontdesk">Frontdesk</option>
          </select>
          {errors.role && (
            <div className="invalid-feedback">{errors.role.message}</div>
          )}
        </div>

        {/* Email */}
        <div className="form-floating mb-3">
          <input
            type="email"
            placeholder="Email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email", { required: "Email is required" })}
          />
          <label>Email</label>
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        {/* Password */}
        <div className="form-floating mb-3 position-relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            {...register("password", { required: "Password is required" })}
          />
          <label>Password</label>
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}

          {/* Eye icon for toggle */}
          <span
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: "pointer", zIndex: "5" }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}
