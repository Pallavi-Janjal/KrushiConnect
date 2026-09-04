import { Notification } from '../types';
import { apiRequest } from './api';

export const notificationService = {
  getUserNotifications: async (_userId?: string): Promise<Notification[]> => {
    try {
      return await apiRequest<Notification[]>('/notifications');
    } catch {
      return [];
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
    } catch {}
  },

  markAllAsRead: async (_userId?: string): Promise<void> => {
    try {
      await apiRequest('/notifications/read-all', { method: 'PATCH' });
    } catch {}
  },

  deleteNotification: async (id: string): Promise<void> => {
    try {
      await apiRequest(`/notifications/${id}`, { method: 'DELETE' });
    } catch {}
  }
};

