import { UsageLog } from '../types';
import { apiRequest } from './api';

export const usageService = {
  getUsageLogs: async (_equipmentId?: string): Promise<UsageLog[]> => {
    try {
      return await apiRequest<UsageLog[]>('/usage');
    } catch {
      return [];
    }
  },

  addUsageLog: async (data: Omit<UsageLog, 'id'>): Promise<UsageLog> => {
    return await apiRequest<UsageLog>('/usage', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
