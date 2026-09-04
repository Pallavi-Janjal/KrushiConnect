import { apiRequest } from './api';

export interface OwnerAnalyticsSummary {
  totalEarnings: number;
  monthlyEarnings: number;
  activeBookingsCount: number;
  totalEquipmentCount: number;
  utilizationRate: number;
  monthlyRevenueData: { month: string; earnings: number; bookingsCount?: number }[];
  equipmentPerformanceData: { name: string; revenue: number; daysRented: number }[];
}

export const analyticsService = {
  getOwnerAnalytics: async (_ownerId?: string): Promise<OwnerAnalyticsSummary> => {
    try {
      const data = await apiRequest<any>('/analytics/owner');
      return {
        totalEarnings: data.totalEarnings || 0,
        monthlyEarnings: data.totalEarnings || 0,
        activeBookingsCount: data.activeBookingsCount || 0,
        totalEquipmentCount: data.totalEquipmentCount || 0,
        utilizationRate: data.utilizationRate || 0,
        monthlyRevenueData: data.monthlyRevenueData || [],
        equipmentPerformanceData: data.equipmentPerformanceData || []
      };
    } catch {
      return {
        totalEarnings: 0,
        monthlyEarnings: 0,
        activeBookingsCount: 0,
        totalEquipmentCount: 0,
        utilizationRate: 0,
        monthlyRevenueData: [],
        equipmentPerformanceData: []
      };
    }
  }
};
