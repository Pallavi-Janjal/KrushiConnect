import { Schema, model, Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: 'FARMER' | 'EQUIPMENT_OWNER' | 'farmer' | 'equipment_owner';
  phone: string;
  location: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserDocument = IUser & Document;

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['FARMER', 'EQUIPMENT_OWNER', 'farmer', 'equipment_owner'], required: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, default: 'India' },
    avatar: { type: String }
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    if (ret.role && String(ret.role).toLowerCase() === 'farmer') ret.role = 'FARMER';
    if (ret.role && String(ret.role).toLowerCase() === 'equipment_owner') ret.role = 'EQUIPMENT_OWNER';
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

export const User = model<IUser>('User', userSchema);
