import { apiService } from './apiService';
import type { AxiosResponse } from 'axios';

export interface Restaurant {
  id: number;
  name: string;
  city: {
    id: number;
    name: string;
  };
  photo: string;
  description: string;
  description_ru?: string;
  description_kz?: string;
  description_en?: string;
  opening_time: string;
  closing_time: string;
  rating: number;
  address?: string;
}

export interface RestaurantListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Restaurant[];
}

class RestaurantService {
  private readonly baseUrl = '/restaurants';

  async getRestaurants(cityId?: number): Promise<RestaurantListResponse> {
    const params = cityId ? { city: cityId } : {};
    const response = await apiService.get<RestaurantListResponse>(this.baseUrl, { params });
    return response.data;
  }

  async getRestaurant(id: number): Promise<Restaurant> {
    const response = await apiService.get<Restaurant>(`${this.baseUrl}/${id}/`);
    return response.data;
  }

  async getRestaurantMenu(restaurantId: number): Promise<any> {
    const response = await apiService.get(`${this.baseUrl}/${restaurantId}/menu/`);
    return response.data;
  }
}

export const restaurantService = new RestaurantService();
