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

export interface RestaurantListParams {
  city?: number;
  search?: string;
  page?: number;
  page_size?: number;
}

class RestaurantService {
  private readonly baseUrl = '/api/v1/restaurants';

  async getRestaurants(
    cityIdOrParams?: number | RestaurantListParams
  ): Promise<RestaurantListResponse> {
    let params: RestaurantListParams = {};

    if (typeof cityIdOrParams === 'number') {
      params.city = cityIdOrParams;
    } else if (cityIdOrParams) {
      params = { ...cityIdOrParams };
    }

    const response = await apiService.get<RestaurantListResponse>(this.baseUrl, {
      params,
    });
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
