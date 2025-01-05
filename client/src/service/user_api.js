import axios from "axios";
import { apiURL } from "./api";
axios.defaults.withCredentials = true;
const cors = require("cors");

cors({
  origin: true,
  credentials: true,
  exposedHeaders: ["set-cookie"],
});

async function login(email, password) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}/userExpress/login/`, {
        email: email,
        password: password,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function register(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}/userExpress/register/`, formData)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// forget password
async function forgetPassword(email) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}/userExpress/forgotPassword/`, {
        email: email,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// reset password with resetToken, newPassword
async function resetPassword(resetToken, newPassword) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}/userExpress/resetPassword/${resetToken}`, {
        password: newPassword,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default {
  login,
  register,
  forgetPassword,
  resetPassword,
};
