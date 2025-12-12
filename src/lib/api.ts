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
    console.log("➡️ Calling", "/room/reservations/");
    return apiClient.post("/room/reservations/", bookingData);
  },

  // getUserBookings: () => {
  //   return apiClient.get("/room/reservations/");
  // },

  cancelBooking: (id: number) => {
    return apiClient.delete(`/bookings/${id}/`);
  },
  getTable: (id: number) => {
    return apiClient.get(`/room/restaurant/${id}/tables/`);
  },
  redirectToStripe: (data: any) => {
    return apiClient.post("/payments/checkout/", data, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTIzMTQ4NDcxLCJpYXQiOjE3NjU0Njg0NzEsImp0aSI6IjdhM2Q5ZDFiZTZjYzQzNGFiZjRmYWM0YzJlZjgzNjRlIiwidXNlcl9pZCI6M30.bQ9JTjMW_KvgS-2zwSJSAWVKCAoH6I6wLqQZQSwINzE`,
      },
    });
  },
};

export { apiClient };
export default apiClient;
