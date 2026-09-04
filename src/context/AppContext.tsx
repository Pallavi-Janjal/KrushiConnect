import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Equipment, Booking, Notification, BookingStatus } from '../types';
import { equipmentService } from '../services/equipmentService';
import { bookingService } from '../services/bookingService';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

interface AppContextType {
  equipment: Equipment[];
  bookings: Booking[];
  notifications: Notification[];
  unreadNotifsCount: number;
  loading: boolean;
  refreshEquipment: () => void;
  refreshBookings: () => void;
  refreshNotifications: () => void;
  addEquipment: (data: Omit<Equipment, 'id' | 'rating' | 'reviewCount' | 'createdAt'>) => Promise<Equipment>;
  updateEquipment: (id: string, updates: Partial<Equipment>) => Promise<Equipment>;
  deleteEquipment: (id: string) => Promise<void>;
  toggleEquipmentAvailability: (id: string) => Promise<Equipment>;
  createBooking: (params: {
    equipmentId: string;
    farmerId: string;
    farmerName: string;
    farmerPhone: string;
    startDate: string;
    endDate: string;
    withOperator: boolean;
    location: string;
    purpose?: string;
  }) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<Booking>;
  requestCompletionOtp: (bookingId: string) => Promise<Booking>;
  verifyOtp: (bookingId: string, otp: string) => Promise<Booking>;
  processPayment: (bookingId: string, paymentMethod: 'ONLINE' | 'CASH', transactionRef?: string) => Promise<Booking>;
  confirmPaymentReceived: (bookingId: string) => Promise<Booking>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshEquipment = useCallback(() => {
    equipmentService.getAllEquipment().then(list => setEquipment(list)).catch(() => setEquipment([]));
  }, []);

  const refreshBookings = useCallback(() => {
    if (user) {
      const fetcher = user.role === 'EQUIPMENT_OWNER'
        ? bookingService.getOwnerBookings(user.id)
        : bookingService.getFarmerBookings(user.id);
      fetcher.then(list => setBookings(list)).catch(() => setBookings([]));
    } else {
      setBookings([]);
    }
  }, [user]);

  const refreshNotifications = useCallback(() => {
    if (user) {
      notificationService.getUserNotifications(user.id).then(list => setNotifications(list)).catch(() => setNotifications([]));
    } else {
      setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    equipmentService.getAllEquipment()
      .then(list => setEquipment(list))
      .catch(() => setEquipment([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      bookingService.getAllBookings().then(list => setBookings(list)).catch(() => setBookings([]));
      notificationService.getUserNotifications(user.id).then(list => setNotifications(list)).catch(() => setNotifications([]));
    } else {
      setBookings([]);
      setNotifications([]);
    }
  }, [user]);

  const addEquipment = async (data: Omit<Equipment, 'id' | 'rating' | 'reviewCount' | 'createdAt'>): Promise<Equipment> => {
    const newEq = await equipmentService.createEquipment(data);
    refreshEquipment();
    return newEq;
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>): Promise<Equipment> => {
    const updated = await equipmentService.updateEquipment(id, updates);
    refreshEquipment();
    return updated;
  };

  const deleteEquipment = async (id: string): Promise<void> => {
    await equipmentService.deleteEquipment(id);
    refreshEquipment();
  };

  const toggleEquipmentAvailability = async (id: string): Promise<Equipment> => {
    const toggled = await equipmentService.toggleAvailability(id);
    refreshEquipment();
    return toggled;
  };

  const createBooking = async (params: {
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
    const newBk = await bookingService.createBooking(params);
    refreshBookings();
    refreshNotifications();
    return newBk;
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<Booking> => {
    const updated = await bookingService.updateBookingStatus(bookingId, status);
    refreshBookings();
    refreshNotifications();
    return updated;
  };

  const requestCompletionOtp = async (bookingId: string): Promise<Booking> => {
    const updated = await bookingService.requestCompletionOtp(bookingId);
    refreshBookings();
    refreshNotifications();
    return updated;
  };

  const verifyOtp = async (bookingId: string, otp: string): Promise<Booking> => {
    const updated = await bookingService.verifyOtp(bookingId, otp);
    refreshBookings();
    refreshNotifications();
    return updated;
  };

  const processPayment = async (bookingId: string, paymentMethod: 'ONLINE' | 'CASH', transactionRef?: string): Promise<Booking> => {
    const updated = await bookingService.processPayment(bookingId, paymentMethod, transactionRef);
    refreshBookings();
    refreshNotifications();
    return updated;
  };

  const confirmPaymentReceived = async (bookingId: string): Promise<Booking> => {
    const updated = await bookingService.confirmPaymentReceived(bookingId);
    refreshBookings();
    refreshNotifications();
    return updated;
  };

  const markNotificationRead = (id: string) => {
    notificationService.markAsRead(id);
    refreshNotifications();
  };

  const markAllNotificationsRead = () => {
    if (user) {
      notificationService.markAllAsRead(user.id);
      refreshNotifications();
    }
  };

  const deleteNotification = async (id: string): Promise<void> => {
    await notificationService.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider value={{
      equipment,
      bookings,
      notifications,
      unreadNotifsCount,
      loading,
      refreshEquipment,
      refreshBookings,
      refreshNotifications,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      toggleEquipmentAvailability,
      createBooking,
      updateBookingStatus,
      requestCompletionOtp,
      verifyOtp,
      processPayment,
      confirmPaymentReceived,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
