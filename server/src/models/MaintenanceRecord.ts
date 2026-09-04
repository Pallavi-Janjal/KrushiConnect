import { Schema, model, Document, Types } from 'mongoose';

export interface IMaintenanceRecord {
  equipmentId: Types.ObjectId;
  equipmentName: string;
  ownerId: Types.ObjectId;
  healthStatus: 'Healthy' | 'Due Soon' | 'Maintenance' | 'Overdue';
  lastServiceDate: string;
  nextServiceDueDate: string;
  serviceType: string;
  cost: number;
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Pending';
  createdAt?: Date;
}

export type IMaintenanceRecordDocument = IMaintenanceRecord & Document;

const maintenanceRecordSchema = new Schema<IMaintenanceRecord>(
  {
    equipmentId: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
    equipmentName: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    healthStatus: {
      type: String,
      enum: ['Healthy', 'Due Soon', 'Maintenance', 'Overdue'],
      default: 'Healthy'
    },
    lastServiceDate: { type: String, required: true },
    nextServiceDueDate: { type: String, required: true },
    serviceType: { type: String, required: true },
    cost: { type: Number, required: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Pending'],
      default: 'Scheduled'
    }
  },
  { timestamps: true }
);

maintenanceRecordSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    if (ret.equipmentId) ret.equipmentId = ret.equipmentId.toString();
    if (ret.ownerId) ret.ownerId = ret.ownerId.toString();
    delete ret.__v;
    return ret;
  }
});

export const MaintenanceRecord = model<IMaintenanceRecord>('MaintenanceRecord', maintenanceRecordSchema);
