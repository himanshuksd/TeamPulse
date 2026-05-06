import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "https://himanshuksd-teampulse.onrender.com";
const API_URL = "http://127.0.0.1:8000";
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
