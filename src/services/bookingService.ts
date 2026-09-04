import { Booking, BookingStatus, Receipt } from '../types';
import { apiRequest } from './api';

export const bookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    try {
      return await apiRequest<Booking[]>('/bookings/my');
    } catch (error) {
      return [];
    }
  },

  getFarmerBookings: async (_farmerId?: string): Promise<Booking[]> => {
    try {
      return await apiRequest<Booking[]>('/bookings/my');
    } catch {
      return [];
    }
  },

  getOwnerBookings: async (_ownerId?: string): Promise<Booking[]> => {
    try {
      return await apiRequest<Booking[]>('/bookings/owner');
    } catch {
      return [];
    }
  },

  createBooking: async (params: {
    equipmentId: string;
    farmerId: string;
    farmerName: string;
    farmerPhone: string;
    startDate: string;
    endDate: string;
    withOperator: boolean;
    location: string;
    purpose?: string;
  }): Promise<Booking> => {
    return await apiRequest<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  updateBookingStatus: async (bookingId: string, status: BookingStatus): Promise<Booking> => {
    return await apiRequest<Booking>(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  requestCompletionOtp: async (bookingId: string): Promise<Booking> => {
    return await apiRequest<Booking>(`/bookings/${bookingId}/request-otp`, {
      method: 'POST'
    });
  },

  verifyOtp: async (bookingId: string, otp: string): Promise<Booking> => {
    return await apiRequest<Booking>(`/bookings/${bookingId}/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ otp })
    });
  },

  processPayment: async (bookingId: string, paymentMethod: 'ONLINE' | 'CASH', transactionRef?: string): Promise<Booking> => {
    return await apiRequest<Booking>(`/bookings/${bookingId}/pay`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod, transactionRef })
    });
  },

  confirmPaymentReceived: async (bookingId: string): Promise<Booking> => {
    return await apiRequest<Booking>(`/bookings/${bookingId}/confirm-payment`, {
      method: 'POST'
    });
  },

  getReceipts: async (): Promise<Receipt[]> => {
    try {
      return await apiRequest<Receipt[]>('/receipts');
    } catch {
      return [];
    }
  },

  getOwnerReceipts: async (_ownerId?: string): Promise<Receipt[]> => {
    try {
      return await apiRequest<Receipt[]>('/receipts');
    } catch {
      return [];
    }
  }
};

