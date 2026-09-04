import { Schema, model, Document, Types } from 'mongoose';

export interface IFarmPlan {
  farmerId: Types.ObjectId;
  cropName: string;
  landAreaAcres: number;
  activity: string;
  requiredEquipmentCategory: string;
  plannedStartDate: string;
  plannedEndDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  notes: string;
  createdAt?: Date;
}

export type IFarmPlanDocument = IFarmPlan & Document;

const farmPlanSchema = new Schema<IFarmPlan>(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cropName: { type: String, required: true },
    landAreaAcres: { type: Number, required: true },
    activity: { type: String, required: true },
    requiredEquipmentCategory: { type: String, required: true },
    plannedStartDate: { type: String, required: true },
    plannedEndDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED'],
      default: 'PLANNED'
    },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

farmPlanSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    if (ret.farmerId) ret.farmerId = ret.farmerId.toString();
    delete ret.__v;
    return ret;
  }
});

export const FarmPlan = model<IFarmPlan>('FarmPlan', farmPlanSchema);
