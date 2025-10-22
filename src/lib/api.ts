import axios from "axios";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
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

export const restaurantAPI = {
  getRestaurants: (cityId?: number) => {
    const params = cityId ? { city: cityId } : {};
    return apiClient.get("/restaurants/", { params });
  },

  getRestaurant: (id: number) => {
    return apiClient.get(`/restaurants/${id}/`);
  },

  getRestaurantMenu: (restaurantId: number) => {
    return apiClient.get(`/restaurants/${restaurantId}/menu/`);
  },
};

export const cityAPI = {
  getCities: () => {
    return apiClient.get("/cities/");
  },

  getCity: (id: number) => {
    return apiClient.get(`/cities/${id}/`);
  },
};

export const dishAPI = {
  getDishes: () => {
    return apiClient.get("/dishes/");
  },

  getDish: (id: number) => {
    return apiClient.get(`/dishes/${id}/`);
  },
};

export const menuAPI = {
  getMenuTypes: () => {
    return apiClient.get("/products/menu-types/");
  },

  getMenuItems: () => {
    return apiClient.get("/products/menu-items/");
  },

  getMenuItemsByType: (typeId: number) => {
    return apiClient.get(`/products/menu-items/?menu_type=${typeId}`);
  },

  getPopularItems: () => {
    return apiClient.get("/products/menu-items/popular/");
  },
};

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

export const offerAPI = {
  getOffers: () => {
    return apiClient.get("/offers/offers/");
  },

  getOffer: (id: number) => {
    return apiClient.get(`/offers/offers/${id}/`);
  },
};

export { apiClient };

export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "/images/placeholder.svg";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};

export default apiClient;
