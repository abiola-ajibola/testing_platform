import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Set your API base URL
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        "Content-Type": "application/json", // Default content type
    },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (e.g., unauthorized)
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      // Optional: Redirect to login or handle token refresh
    }
    return Promise.reject(error);
  }
);

export default apiClient;
