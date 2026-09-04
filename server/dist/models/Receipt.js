"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Receipt = void 0;
const mongoose_1 = require("mongoose");
const receiptSchema = new mongoose_1.Schema({
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Booking', required: true },
    farmerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
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
}, { timestamps: true });
receiptSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.bookingId)
            ret.bookingId = ret.bookingId.toString();
        if (ret.farmerId)
            ret.farmerId = ret.farmerId.toString();
        if (ret.ownerId)
            ret.ownerId = ret.ownerId.toString();
        delete ret.__v;
        return ret;
    }
});
exports.Receipt = (0, mongoose_1.model)('Receipt', receiptSchema);
