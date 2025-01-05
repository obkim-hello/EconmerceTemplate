import React, { useState } from "react";
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import user_api from "../../service/user_api";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [Message, setMessage] = useState({
    type: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      tempErrors.email = "Valid email is required";
    if (!formData.password || formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters long";
    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        user_api
          .register(formData)
          .then(() => {
            setLoading(true);
            setMessage({
              type: "success",
              message: "Registration successful, redirecting to login...",
            });
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          })
          .catch((error) => {
            // setServerError(
            //   error.response?.data?.data || "An unexpected error occurred"
            // );
            setMessage({
              type: "error",
              message:
                error.response?.data?.data || "An unexpected error occurred",
            });
            setTimeout(() => {
              setMessage({
                type: "",
                message: "",
              });
            }, 3000);
          });
      } catch (error) {
        setMessage({
          type: "error",
          message: "An unexpected error occurred",
        });
        setTimeout(() => {
          setMessage({
            type: "",
            message: "",
          });
        }, 3000);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-10 ">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Register
        </h2>
        <div className="max-w-sm mx-auto fixed right-10 top-24 flex items-center justify-center">
          {Message.message !== "" && (
            <Alert
              severity={Message.type}
              onClose={() =>
                setMessage({
                  type: "",
                  message: "",
                })
              }
            >
              {Message.message}
            </Alert>
          )}
        </div>

        <div className="bg-white shadow-md rounded-md p-6 max-w-sm mx-auto">
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <TextField
              label="Name"
              name="name"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <CircularProgress />
                </div>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
