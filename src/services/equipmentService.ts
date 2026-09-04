import { Equipment } from '../types';
import { apiRequest } from './api';

export const equipmentService = {
  getAllEquipment: async (): Promise<Equipment[]> => {
    try {
      return await apiRequest<Equipment[]>('/equipment');
    } catch (error) {
      console.error('Failed to fetch equipment from server:', error);
      return [];
    }
  },

  getEquipmentById: async (id: string): Promise<Equipment | undefined> => {
    try {
      return await apiRequest<Equipment>(`/equipment/${id}`);
    } catch {
      return undefined;
    }
  },

  getOwnerEquipment: async (ownerId: string): Promise<Equipment[]> => {
    try {
      return await apiRequest<Equipment[]>(`/equipment/owner/${ownerId}`);
    } catch {
      return [];
    }
  },

  createEquipment: async (data: Omit<Equipment, 'id' | 'rating' | 'reviewCount' | 'createdAt'>): Promise<Equipment> => {
    return await apiRequest<Equipment>('/equipment', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateEquipment: async (id: string, updates: Partial<Equipment>): Promise<Equipment> => {
    return await apiRequest<Equipment>(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  deleteEquipment: async (id: string): Promise<void> => {
    await apiRequest(`/equipment/${id}`, {
      method: 'DELETE'
    });
  },

  toggleAvailability: async (id: string): Promise<Equipment> => {
    return await apiRequest<Equipment>(`/equipment/${id}/toggle-availability`, {
      method: 'PATCH'
    });
  },

  searchAndFilter: async (params: {
    query?: string;
    category?: string;
    location?: string;
    state?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }): Promise<Equipment[]> => {
    const searchParams = new URLSearchParams();
    if (params.query && params.query.trim()) searchParams.append('query', params.query.trim());
    if (params.category && params.category !== 'All' && params.category !== 'all') searchParams.append('category', params.category);
    if (params.location && params.location !== 'All' && params.location !== 'all') searchParams.append('location', params.location);
    if (params.state && params.state !== 'All' && params.state !== 'all') searchParams.append('state', params.state);
    if (params.minPrice) searchParams.append('minPrice', String(params.minPrice));
    if (params.maxPrice && params.maxPrice > 0) searchParams.append('maxPrice', String(params.maxPrice));
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);

    const queryString = searchParams.toString();
    return await apiRequest<Equipment[]>(queryString ? `/equipment?${queryString}` : '/equipment');
  }
};
