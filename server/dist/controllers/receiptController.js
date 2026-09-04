"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserReceipts = void 0;
const Receipt_1 = require("../models/Receipt");
const getUserReceipts = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const userId = req.user.userId;
        const receipts = await Receipt_1.Receipt.find({
            $or: [{ farmerId: userId }, { ownerId: userId }]
        }).sort({ createdAt: -1 });
        res.json(receipts.map(r => r.toJSON()));
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch receipts.' });
    }
};
exports.getUserReceipts = getUserReceipts;
