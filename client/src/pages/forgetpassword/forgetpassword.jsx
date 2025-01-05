import React, { useState } from "react";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import user_api from "../../service/user_api";
import { useNavigate } from "react-router-dom";

export default function Forgetpassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setEmailError("");
    setServerError("");
    setSuccessMessage("");

    let valid = true;
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (valid) {
      try {
        await user_api
          .forgetPassword(email)
          .then(() => {
            setIsLoading(true);
            setSuccessMessage("Reset password link sent to your email");
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          })
          .catch((error) => {
            setServerError(
              error.response?.data?.message || "An unexpected error occurred"
            );
          });
        //   const response = await axios.post("/api/user/forgot-password", { email });
        //   setSuccessMessage(response.data.message);
      } catch (error) {
        setServerError(
          error.response?.data?.message || "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Reset Password
        </h2>
        <div className="max-w-sm mx-auto">
          <div className="max-w-sm mx-auto fixed right-10 top-24 flex items-center justify-center">
            {serverError && (
              <Alert severity="error" onClose={() => setServerError("")}>
                {serverError}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" onClose={() => setSuccessMessage("")}>
                {successMessage}
              </Alert>
            )}
          </div>
          <div className="bg-white shadow-md rounded-md p-6">
            <form
              onSubmit={handleResetPassword}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Reset Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
