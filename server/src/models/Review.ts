import { Schema, model, Document, Types } from 'mongoose';

export interface IReview {
  bookingId?: Types.ObjectId;
  equipmentId: Types.ObjectId;
  farmerId: Types.ObjectId;
  farmerName: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export type IReviewDocument = IReview & Document;

const reviewSchema = new Schema<IReview>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    equipmentId: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
  },
  { timestamps: true }
);

reviewSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    if (ret.bookingId) ret.bookingId = ret.bookingId.toString();
    if (ret.equipmentId) ret.equipmentId = ret.equipmentId.toString();
    if (ret.farmerId) ret.farmerId = ret.farmerId.toString();
    delete ret.__v;
    return ret;
  }
});

export const Review = model<IReview>('Review', reviewSchema);
