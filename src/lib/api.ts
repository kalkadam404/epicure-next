import axios from "axios";

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";
const API_BASE_URL = "/api/proxy";
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const userAPI = {
  register: (userData: any) => {
    return apiClient.post("/auth/register/", userData);
  },

  login: (credentials: any) => {
    return apiClient.post("/auth/login/", credentials);
  },

  getProfile: () => {
    return apiClient.get("/auth/user/");
  },

  updateProfile: (userData: any) => {
    return apiClient.patch("/auth/user/", userData);
  },
};

export const bookingAPI = {
  createBooking: (bookingData: any) => {
    return apiClient.post("/bookings/", bookingData);
  },

  getUserBookings: () => {
    return apiClient.get("/bookings/");
  },

  cancelBooking: (id: number) => {
    return apiClient.delete(`/bookings/${id}/`);
  },
};

export { apiClient };
export default apiClient;
