import { Schema, model, Document, Types } from 'mongoose';

export interface IUsageLog {
  equipmentId: Types.ObjectId;
  equipmentName: string;
  ownerId: Types.ObjectId;
  date: string;
  hoursUsed: number;
  fuelConsumedLiters: number;
  acresCovered: number;
  operatorName: string;
  notes: string;
  createdAt?: Date;
}

export type IUsageLogDocument = IUsageLog & Document;

const usageLogSchema = new Schema<IUsageLog>(
  {
    equipmentId: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
    equipmentName: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    hoursUsed: { type: Number, required: true },
    fuelConsumedLiters: { type: Number, required: true },
    acresCovered: { type: Number, required: true },
    operatorName: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

usageLogSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    if (ret.equipmentId) ret.equipmentId = ret.equipmentId.toString();
    if (ret.ownerId) ret.ownerId = ret.ownerId.toString();
    delete ret.__v;
    return ret;
  }
});

export const UsageLog = model<IUsageLog>('UsageLog', usageLogSchema);
