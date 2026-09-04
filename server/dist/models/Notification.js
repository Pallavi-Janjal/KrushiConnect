"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['BOOKING', 'MAINTENANCE', 'SYSTEM', 'REVIEW'],
        default: 'SYSTEM'
    },
    isRead: { type: Boolean, default: false },
    link: { type: String }
}, { timestamps: true });
notificationSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.userId)
            ret.userId = ret.userId.toString();
        delete ret.__v;
        return ret;
    }
});
exports.Notification = (0, mongoose_1.model)('Notification', notificationSchema);
