import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../../components/navbar/Navbar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "../../components/GoogleLogin/GoogleLogin";
import { globalStore } from "../../store/globalStore";
import { useNavigate } from "react-router-dom";
import user_api from "../../service/user_api";
import { sessionService } from "redux-react-session";
import { TextField, Button, Alert } from "@mui/material";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  useEffect(() => {
    if (globalStore.getState().session.authenticated) {
      navigate("/home");
    }
  }, []);
  const handleLogin = (e) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      user_api
        .login(email, password)
        .then(async (res) => {
          await sessionService.saveUser(res.toString());
          await sessionService.saveSession(res.toString());
          if (window.location.href.includes("?next=")) {
            const next = window.location.href.split("?next=")[1];
            navigate(next);
          } else {
            navigate("/");
          }
        })
        .catch((error) => {
          setServerError(
            error.response?.data?.message || "An unexpected error occurred"
          );
        });
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-10 ">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h2>{" "}
        <div className="max-w-sm mx-auto fixed right-10 top-24 flex items-center justify-center">
          {serverError && (
            <Alert severity="error" onClose={() => setServerError("")}>
              {serverError}
            </Alert>
          )}
        </div>
        <div className="bg-white shadow-md rounded-md p-6 max-w-sm mx-auto">
          <form
            onSubmit={handleLogin}
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
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              fullWidth
            />
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
          </form>

          <div className="text-center mb-6 text-gray-700 pt-4">Or</div>

          <GoogleOAuthProvider clientId="1022053143505-0897r9m3d5cdogo34m71v64et84djjrl.apps.googleusercontent.com">
            <div>
              <GoogleLogin></GoogleLogin>
            </div>
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default Login;
