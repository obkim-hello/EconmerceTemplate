import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import user_api from "../../service/user_api";

export default function Resetpassword() {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setServerError("");
    setSuccessMessage("");

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      //   const response = await axios.post(
      //     `/api/user/reset-password/${resetToken}`,
      //     {
      //       newPassword,
      //     }
      //   );
      user_api
        .resetPassword(resetToken, newPassword)
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
    } catch (error) {
      setServerError(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
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
                label="New Password"
                type="password"
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                fullWidth
              />
              <TextField
                label="Confirm New Password"
                type="password"
                variant="outlined"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
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
