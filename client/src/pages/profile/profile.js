import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { get_user } from "../../service/decrypt";
import { globalStore } from "../../store/globalStore";
import Navbar from "../../components/navbar/Navbar";

export default function Profile() {
  const sessioncode = useSelector((state) => state.session.user);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessioncode && sessioncode !== "") {
      const u = get_user(sessioncode);
      console.log("Profile user:", u);
      setFormData({
        name: u.name,
        email: u.email,
      });
      setUser(u);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.put(`/api/user/profile`, formData);
      console.log("Profile updated:", response.data);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.put(`/api/user/change-password`, {
        currentPassword,
        newPassword,
      });
      console.log("Password changed:", response.data);
      alert("Password changed successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <div className="flex flex-col items-center">
          <Avatar alt={formData.name} src={user?.profileImage} />
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
            disabled
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleProfileUpdate}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Update Profile"}
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </div>
        {!user.isGoogleAuth && (
          <div className="mt-8">
            <Typography variant="h5" gutterBottom>
              Change Password
            </Typography>
            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              margin="normal"
              fullWidth
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePasswordChange}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Change Password"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
