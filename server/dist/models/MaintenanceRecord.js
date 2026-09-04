"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceRecord = void 0;
const mongoose_1 = require("mongoose");
const maintenanceRecordSchema = new mongoose_1.Schema({
    equipmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    equipmentName: { type: String, required: true },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    healthStatus: {
        type: String,
        enum: ['Healthy', 'Due Soon', 'Maintenance', 'Overdue'],
        default: 'Healthy'
    },
    lastServiceDate: { type: String, required: true },
    nextServiceDueDate: { type: String, required: true },
    serviceType: { type: String, required: true },
    cost: { type: Number, required: true },
    notes: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Pending'],
        default: 'Scheduled'
    }
}, { timestamps: true });
maintenanceRecordSchema.set('toJSON', {
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
exports.MaintenanceRecord = (0, mongoose_1.model)('MaintenanceRecord', maintenanceRecordSchema);
