import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

const EditUserModal = ({
  show,
  onHide,
  userData,
  showPassword = true, // default to true
  onSave,
  role,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone_no || "",
        password: "", // do not pre-fill passwords
        specialization: userData.specialization || "",
        degree: userData.degree || "",
        experience: userData.experience || "",
      });
    }
  }, [userData, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit {role}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              {...register("name", {
                required: "Name is required",
                maxLength: {
                  value: 100,
                  message: "Name cannot exceed 100 characters",
                },
              })}
              type="text"
            />
            <p className="text-danger">{errors.name?.message}</p>
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  message: "Only @gmail.com emails are allowed",
                },
              })}
              type="email"
            />
            <p className="text-danger">{errors.email?.message}</p>
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone must be exactly 10 digits",
                },
              })}
              type="text"
            />
            <p className="text-danger">{errors.phone?.message}</p>
          </Form.Group>

          {/* Password */}
          {showPassword && (
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Password cannot exceed 20 characters",
                  },
                })}
                type="password"
              />
              <p className="text-danger">{errors.password?.message}</p>
            </Form.Group>
          )}

          {/* Doctor-specific fields */}
          {role === "Doctor" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  {...register("specialization", {
                    required: "Specialization is required",
                  })}
                  type="text"
                />
                <p className="text-danger">{errors.specialization?.message}</p>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Degree</Form.Label>
                <Form.Control {...register("degree")} type="text" />
                <p className="text-danger">{errors.degree?.message}</p>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Experience (years)</Form.Label>
                <Form.Control
                  {...register("experience", {
                    min: {
                      value: 0,
                      message: "Experience can't be negative",
                    },
                    max: {
                      value: 50,
                      message: "Experience seems too high",
                    },
                  })}
                  type="number"
                />
                <p className="text-danger">{errors.experience?.message}</p>
              </Form.Group>
            </>
          )}

          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserModal;
