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

async function register(email, password) {}

export default { login, register };
