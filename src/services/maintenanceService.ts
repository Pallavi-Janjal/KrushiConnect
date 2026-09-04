import { MaintenanceRecord, MaintenanceHealth } from '../types';
import { apiRequest } from './api';

export const maintenanceService = {
  getMaintenanceRecords: async (_equipmentId?: string): Promise<MaintenanceRecord[]> => {
    try {
      return await apiRequest<MaintenanceRecord[]>('/maintenance');
    } catch {
      return [];
    }
  },

  addRecord: async (data: Omit<MaintenanceRecord, 'id'>): Promise<MaintenanceRecord> => {
    return await apiRequest<MaintenanceRecord>('/maintenance', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateRecordStatus: async (
    id: string,
    status: 'Scheduled' | 'Completed' | 'Pending',
    healthStatus?: MaintenanceHealth
  ): Promise<MaintenanceRecord> => {
    return await apiRequest<MaintenanceRecord>(`/maintenance/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, healthStatus })
    });
  }
};
