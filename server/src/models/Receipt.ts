import { Schema, model, Document, Types } from 'mongoose';

export interface IReceipt {
  bookingId: Types.ObjectId;
  farmerId: Types.ObjectId;
  ownerId: Types.ObjectId;
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
  receiptNumber: string;
  createdAt?: Date;
}

export type IReceiptDocument = IReceipt & Document;

const receiptSchema = new Schema<IReceipt>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmerName: { type: String, required: true },
    ownerName: { type: String, required: true },
    equipmentName: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    subtotal: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Krushi Direct Pay' },
    receiptNumber: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

receiptSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    if (ret.bookingId) ret.bookingId = ret.bookingId.toString();
    if (ret.farmerId) ret.farmerId = ret.farmerId.toString();
    if (ret.ownerId) ret.ownerId = ret.ownerId.toString();
    delete ret.__v;
    return ret;
  }
});

export const Receipt = model<IReceipt>('Receipt', receiptSchema);
