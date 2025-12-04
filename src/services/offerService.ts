import { apiService } from './apiService';
import type { AxiosResponse } from 'axios';

export interface OfferItem {
  description: string;
  description_ru?: string;
  description_en?: string;
  description_kz?: string;
}

export interface Offer {
  id: number;
  title: string;
  title_ru?: string;
  title_kz?: string;
  title_en?: string;
  description?: string;
  description_ru?: string;
  description_kz?: string;
  description_en?: string;
  image: string;
  old_price?: string | number;
  new_price: string | number;
  restaurant?: {
    id: number;
    name: string;
  };
  is_active?: boolean;
  items?: OfferItem[];
  badge?: string;
  people_count?: number;
  per_person?: boolean;
}

export interface OfferListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Offer[];
}

class OfferService {
  private readonly baseUrl = '/offers/offers';

  async getOffers(): Promise<Offer[]> {
    const response = await apiService.get<OfferListResponse>(this.baseUrl);
    return response.data.results || [];
  }

  async getOffer(id: number): Promise<Offer> {
    const response = await apiService.get<Offer>(`${this.baseUrl}/${id}/`);
    return response.data;
  }
}

export const offerService = new OfferService();
