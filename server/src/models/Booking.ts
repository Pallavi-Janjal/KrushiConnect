import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking {
  equipmentId: Types.ObjectId;
  equipmentName: string;
  equipmentImage: string;
  category: string;
  farmerId: Types.ObjectId;
  farmerName: string;
  farmerPhone: string;
  ownerId: Types.ObjectId;
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
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'WORK_COMPLETED' | 'COMPLETED' | 'CANCELLED';
  workCompleted: boolean;
  otpRequested: boolean;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export type IBookingDocument = IBooking & Document;

const bookingSchema = new Schema<IBooking>(
  {
    equipmentId: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
    equipmentName: { type: String, required: true },
    equipmentImage: { type: String, default: '' },
    category: { type: String, default: 'General' },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalDays: { type: Number, required: true },
    withOperator: { type: Boolean, default: false },
    dailyRate: { type: Number, required: true },
    operatorFee: { type: Number, default: 0 },
    platformFee: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    location: { type: String, required: true },
    purpose: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'WORK_COMPLETED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING'
    },
    workCompleted: { type: Boolean, default: false },
    otpRequested: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID'],
      default: 'PENDING'
    },
    paymentMethod: { type: String, default: '' },
    completionOtp: { type: String, default: '' },
    transactionRef: { type: String, default: '' },
    bankDetails: {
      bankName: { type: String, default: 'State Bank of India' },
      accountNumber: { type: String, default: '39482019482' },
      ifscCode: { type: String, default: 'SBIN0004829' },
      upiId: { type: String, default: 'owner@upipay' }
    }
  },
  { timestamps: true }
);

bookingSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    if (ret.equipmentId) ret.equipmentId = ret.equipmentId.toString();
    if (ret.farmerId) ret.farmerId = ret.farmerId.toString();
    if (ret.ownerId) ret.ownerId = ret.ownerId.toString();
    delete ret.__v;
    return ret;
  }
});

export const Booking = model<IBooking>('Booking', bookingSchema);

