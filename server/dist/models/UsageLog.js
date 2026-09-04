"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageLog = void 0;
const mongoose_1 = require("mongoose");
const usageLogSchema = new mongoose_1.Schema({
    equipmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    equipmentName: { type: String, required: true },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    hoursUsed: { type: Number, required: true },
    fuelConsumedLiters: { type: Number, required: true },
    acresCovered: { type: Number, required: true },
    operatorName: { type: String, default: '' },
    notes: { type: String, default: '' }
}, { timestamps: true });
usageLogSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.equipmentId)
            ret.equipmentId = ret.equipmentId.toString();
        if (ret.ownerId)
            ret.ownerId = ret.ownerId.toString();
        delete ret.__v;
        return ret;
    }
});
exports.UsageLog = (0, mongoose_1.model)('UsageLog', usageLogSchema);
