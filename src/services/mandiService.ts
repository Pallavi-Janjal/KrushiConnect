import { MandiPrice } from '../types';
import { apiRequest } from './api';

export interface MandiApiResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  rates: MandiPrice[];
}

export interface MandiQueryParams {
  state?: string;
  district?: string;
  commodity?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const mandiService = {
  getMandiPrices: async (params: MandiQueryParams = {}): Promise<MandiApiResponse> => {
    try {
      const query = new URLSearchParams();
      if (params.state && params.state !== 'ALL') query.append('state', params.state);
      if (params.district && params.district !== 'ALL') query.append('district', params.district);
      if (params.commodity && params.commodity !== 'ALL') query.append('commodity', params.commodity);
      if (params.search) query.append('search', params.search);
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());

      const url = `/mandi?${query.toString()}`;
      const res = await apiRequest<MandiApiResponse>(url);

      if (res && Array.isArray(res.rates)) {
        return res;
      }
      return { total: 0, page: 1, limit: 100, totalPages: 1, rates: [] };
    } catch (err) {
      console.error('Error fetching live mandi prices:', err);
      return { total: 0, page: 1, limit: 100, totalPages: 1, rates: [] };
    }
  }
};
