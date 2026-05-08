import axios from "axios";
// const baseURL = import.meta.env.VITE_API_URL|| "http://localhost:4000/api/";
const baseURL = import.meta.env.VITE_API_URL|| "https://mern-digitaldhokanproject.onrender.com/api/";
export const API = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const APIWITHTOKEN = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add interceptor to attach token dynamically
APIWITHTOKEN.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const APIWITHADMINTOKEN = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add interceptor to attach admin token dynamically
APIWITHADMINTOKEN.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.Authorization = adminToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
