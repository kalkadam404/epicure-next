import { apiService } from './apiService';
import type { AxiosResponse } from 'axios';

export interface MenuType {
  id: number;
  name: string;
  name_ru?: string;
  name_kz?: string;
  name_en?: string;
}

export interface Dish {
  id: number;
  name: string;
  name_ru?: string;
  name_kz?: string;
  name_en?: string;
  description?: string;
  description_ru?: string;
  description_kz?: string;
  description_en?: string;
  price: number;
  image: string;
  menu_type_details?: MenuType;
  restaurant_details?: {
    id: number;
    name: string;
  };
  is_popular?: boolean;
}

export interface DishListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Dish[];
}

class MenuService {
  private readonly menuTypesUrl = '/products/menu-types';
  private readonly menuItemsUrl = '/products/menu-items';

  async getMenuTypes(): Promise<MenuType[]> {
    const response = await apiService.get<{ results: MenuType[] }>(this.menuTypesUrl);
    return response.data.results || [];
  }

  async getMenuItems(): Promise<DishListResponse> {
    const response = await apiService.get<DishListResponse>(this.menuItemsUrl);
    return response.data;
  }

  async getMenuItemsByType(typeId: number): Promise<DishListResponse> {
    const response = await apiService.get<DishListResponse>(this.menuItemsUrl, {
      params: { menu_type: typeId }
    });
    return response.data;
  }

  async getPopularItems(): Promise<Dish[]> {
    const response = await apiService.get<Dish[]>(`${this.menuItemsUrl}/popular/`);
    return response.data;
  }

  async searchDishes(query: string): Promise<Dish[]> {
    const response = await apiService.get<DishListResponse>(this.menuItemsUrl, {
      params: { search: query }
    });
    return response.data.results || [];
  }
}

export const menuService = new MenuService();
