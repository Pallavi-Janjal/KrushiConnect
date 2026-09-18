import { Schema, model, Document } from 'mongoose';

export interface IOtp {
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

export type IOtpDocument = IOtp & Document;

const otpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    otp: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true,
      // MongoDB TTL index: automatically deletes the document when expiresAt timestamp is reached
      index: { expires: 0 }
    }
  },
  { timestamps: true }
);

export const Otp = model<IOtp>('Otp', otpSchema);
