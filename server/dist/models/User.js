"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['FARMER', 'EQUIPMENT_OWNER', 'farmer', 'equipment_owner'], required: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, default: 'India' },
    avatar: { type: String }
}, { timestamps: true });
userSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.role && String(ret.role).toLowerCase() === 'farmer')
            ret.role = 'FARMER';
        if (ret.role && String(ret.role).toLowerCase() === 'equipment_owner')
            ret.role = 'EQUIPMENT_OWNER';
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
    }
});
exports.User = (0, mongoose_1.model)('User', userSchema);
