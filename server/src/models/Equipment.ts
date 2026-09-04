import { Schema, model, Document, Types } from 'mongoose';

export interface IEquipment {
  ownerId: Types.ObjectId;
  ownerName: string;
  ownerPhone: string;
  name: string;
  category: string;
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
  specifications: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IEquipmentDocument = IEquipment & Document;

const equipmentSchema = new Schema<IEquipment>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, default: 'Standard' },
    hp: { type: Number, required: true },
    fuelType: { type: String, default: 'Diesel' },
    description: { type: String, required: true },
    location: { type: String, required: true },
    state: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    pricePerHour: { type: Number },
    operatorIncluded: { type: Boolean, default: false },
    operatorCostPerDay: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    images: [{ type: String }],
    specifications: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

equipmentSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    if (ret.ownerId) ret.ownerId = ret.ownerId.toString();
    delete ret.__v;
    return ret;
  }
});

export const Equipment = model<IEquipment>('Equipment', equipmentSchema);
