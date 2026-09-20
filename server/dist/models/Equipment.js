"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Equipment = void 0;
const mongoose_1 = require("mongoose");
const equipmentSchema = new mongoose_1.Schema({
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, default: 'Standard' },
    hp: { type: Number, required: true },
    fuelType: { type: String, default: 'Diesel' },
    description: { type: String, required: true },
    location: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String },
    taluka: { type: String },
    village: { type: String },
    pricePerDay: { type: Number, required: true },
    pricePerHour: { type: Number },
    pricePerHectare: { type: Number },
    pricingUnit: { type: String, enum: ['PER_HECTARE', 'PER_HOUR', 'BOTH'], default: 'PER_HECTARE' },
    operatorIncluded: { type: Boolean, default: false },
    operatorCostPerDay: { type: Number, default: 0 },
    operatorCostPerHour: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    images: [{ type: String }],
    specifications: { type: mongoose_1.Schema.Types.Mixed, default: {} }
}, { timestamps: true });
equipmentSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.ownerId)
            ret.ownerId = ret.ownerId.toString();
        if (Array.isArray(ret.images)) {
            ret.images = ret.images.map((img) => {
                if (typeof img === 'string' && img.includes('/uploads/')) {
                    return '/uploads/' + img.split('/uploads/')[1];
                }
                return img;
            });
        }
        delete ret.__v;
        return ret;
    }
});
exports.Equipment = (0, mongoose_1.model)('Equipment', equipmentSchema);
