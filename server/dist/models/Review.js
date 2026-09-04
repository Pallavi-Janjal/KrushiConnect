"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Booking' },
    equipmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    farmerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    farmerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, { timestamps: true });
reviewSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.bookingId)
            ret.bookingId = ret.bookingId.toString();
        if (ret.equipmentId)
            ret.equipmentId = ret.equipmentId.toString();
        if (ret.farmerId)
            ret.farmerId = ret.farmerId.toString();
        delete ret.__v;
        return ret;
    }
});
exports.Review = (0, mongoose_1.model)('Review', reviewSchema);
