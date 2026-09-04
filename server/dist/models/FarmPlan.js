"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmPlan = void 0;
const mongoose_1 = require("mongoose");
const farmPlanSchema = new mongoose_1.Schema({
    farmerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
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
}, { timestamps: true });
farmPlanSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.farmerId)
            ret.farmerId = ret.farmerId.toString();
        delete ret.__v;
        return ret;
    }
});
exports.FarmPlan = (0, mongoose_1.model)('FarmPlan', farmPlanSchema);
