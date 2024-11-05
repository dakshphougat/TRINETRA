import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.request);
    } else {
      // Error setting up request
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
