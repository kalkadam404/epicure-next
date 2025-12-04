import { apiService } from './apiService';
import type { AxiosResponse } from 'axios';

export interface City {
  id: number;
  name: string;
  name_ru?: string;
  name_kz?: string;
  name_en?: string;
}

export interface CityListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: City[];
}

class CityService {
  private readonly baseUrl = '/cities';

  async getCities(): Promise<City[]> {
    const response = await apiService.get<CityListResponse>(this.baseUrl);
    return response.data.results || [];
  }

  async getCity(id: number): Promise<City> {
    const response = await apiService.get<City>(`${this.baseUrl}/${id}/`);
    return response.data;
  }
}

export const cityService = new CityService();
