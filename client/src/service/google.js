import axios from "axios";
axios.defaults.withCredentials = true;


const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);
