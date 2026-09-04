"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    equipmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    equipmentName: { type: String, required: true },
    equipmentImage: { type: String, default: '' },
    category: { type: String, default: 'General' },
    farmerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, required: true },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
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
}, { timestamps: true });
bookingSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.equipmentId)
            ret.equipmentId = ret.equipmentId.toString();
        if (ret.farmerId)
            ret.farmerId = ret.farmerId.toString();
        if (ret.ownerId)
            ret.ownerId = ret.ownerId.toString();
        delete ret.__v;
        return ret;
    }
});
exports.Booking = (0, mongoose_1.model)('Booking', bookingSchema);
