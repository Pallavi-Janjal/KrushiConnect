import { Review } from '../types';
import { apiRequest } from './api';

export const reviewService = {
  getEquipmentReviews: async (equipmentId: string): Promise<Review[]> => {
    try {
      return await apiRequest<Review[]>(`/reviews/equipment/${equipmentId}`);
    } catch {
      return [];
    }
  },

  addReview: async (params: {
    bookingId?: string;
    equipmentId: string;
    farmerId?: string;
    farmerName?: string;
    rating: number;
    comment: string;
  }): Promise<Review> => {
    return await apiRequest<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }
};
