import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Crucial for httpOnly cookies
});

// Response interceptor to handle standard API format
api.interceptors.response.use(
  (response) => {
    // If our backend returns { success, message, data, meta }
    // We already refactored backend to do this.
    return response.data;
  },
  (error) => {
    // Handle specific status codes if needed
    const message = error.response?.data?.message || "Something went wrong";
    const data = error.response?.data?.data || null;
    
    return Promise.reject({
      message,
      data,
      status: error.response?.status,
    });
  }
);

export default api;
