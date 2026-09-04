export type UserRole = 'FARMER' | 'EQUIPMENT_OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
  avatar?: string;
  createdAt: string;
}

export type EquipmentCategory = 
  | 'Tractor' 
  | 'Harvester' 
  | 'Seeder' 
  | 'Sprayer' 
  | 'Tiller' 
  | 'Rotavator' 
  | 'Cultivator' 
  | 'Balers' 
  | 'Thresher'
  | 'Other';

export interface Equipment {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  name: string;
  category: EquipmentCategory;
  brand: string;
  model: string;
  hp: number;
  fuelType: string;
  description: string;
  location: string;
  state: string;
  pricePerDay: number;
  pricePerHour?: number;
  operatorIncluded: boolean;
  operatorCostPerDay: number;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  images: string[];
  specifications: Record<string, string>;
  createdAt: string;
}

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'WORK_COMPLETED' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  category: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  withOperator: boolean;
  dailyRate: number;
  operatorFee: number;
  platformFee: number;
  totalAmount: number;
  location: string;
  purpose: string;
  status: BookingStatus;
  workCompleted?: boolean;
  otpRequested?: boolean;
  paymentStatus: 'PENDING' | 'PAID';
  paymentMethod?: string;
  completionOtp?: string;
  transactionRef?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
  };
  createdAt: string;
}


export interface Review {
  id: string;
  bookingId: string;
  equipmentId: string;
  farmerId: string;
  farmerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'MAINTENANCE' | 'SYSTEM' | 'REVIEW';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export type MaintenanceHealth = 'Healthy' | 'Due Soon' | 'Maintenance' | 'Overdue';

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  healthStatus: MaintenanceHealth;
  lastServiceDate: string;
  nextServiceDueDate: string;
  serviceType: string;
  cost: number;
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Pending';
}

export interface UsageLog {
  id: string;
  equipmentId: string;
  equipmentName: string;
  date: string;
  hoursUsed: number;
  fuelConsumedLiters: number;
  acresCovered: number;
  operatorName: string;
  notes: string;
}

export interface FarmPlan {
  id: string;
  farmerId: string;
  cropName: string;
  landAreaAcres: number;
  activity: string;
  requiredEquipmentCategory: string;
  plannedStartDate: string;
  plannedEndDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  notes: string;
}

export interface MandiPrice {
  id: string;
  commodity: string;
  mandiName: string;
  state: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  modalPrice?: number;
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  unit: string;
  updatedAt: string;
  isDemo?: boolean;
  trendHistory: { date: string; price: number }[];
}

export interface Receipt {
  id: string;
  bookingId: string;
  farmerName: string;
  ownerName: string;
  equipmentName: string;
  startDate: string;
  endDate: string;
  subtotal: number;
  platformFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
}

export interface SmartMatchCriteria {
  crop: string;
  landArea: number;
  activity: string;
  location: string;
  preferredDate: string;
  maxBudget: number;
  equipmentCategory?: string;
}

export interface SmartMatchResult {
  equipment: Equipment;
  matchScore: number;
  matchReasons: string[];
}
