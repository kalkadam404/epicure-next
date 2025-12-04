import { apiService } from './apiService';
import type { AxiosResponse } from 'axios';

export interface Offer {
  id: number;
  title: string;
  title_ru?: string;
  title_kz?: string;
  title_en?: string;
  description: string;
  description_ru?: string;
  description_kz?: string;
  description_en?: string;
  image: string;
  old_price?: number;
  new_price: number;
  restaurant?: {
    id: number;
    name: string;
  };
  is_active: boolean;
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
