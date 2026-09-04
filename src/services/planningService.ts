import { FarmPlan } from '../types';
import { apiRequest } from './api';

export const planningService = {
  getFarmerPlans: async (_farmerId?: string): Promise<FarmPlan[]> => {
    try {
      return await apiRequest<FarmPlan[]>('/planning');
    } catch {
      return [];
    }
  },

  createPlan: async (data: Omit<FarmPlan, 'id'>): Promise<FarmPlan> => {
    return await apiRequest<FarmPlan>('/planning', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deletePlan: async (id: string): Promise<void> => {
    await apiRequest(`/planning/${id}`, { method: 'DELETE' });
  }
};
