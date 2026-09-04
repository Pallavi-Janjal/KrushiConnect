import { Schema, model, Document, Types } from 'mongoose';

export interface INotification {
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: 'BOOKING' | 'MAINTENANCE' | 'SYSTEM' | 'REVIEW';
  isRead: boolean;
  link?: string;
  createdAt?: Date;
}

export type INotificationDocument = INotification & Document;

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['BOOKING', 'MAINTENANCE', 'SYSTEM', 'REVIEW'],
      default: 'SYSTEM'
    },
    isRead: { type: Boolean, default: false },
    link: { type: String }
  },
  { timestamps: true }
);

notificationSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    if (ret.userId) ret.userId = ret.userId.toString();
    delete ret.__v;
    return ret;
  }
});

export const Notification = model<INotification>('Notification', notificationSchema);
