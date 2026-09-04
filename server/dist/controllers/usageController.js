"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsageLog = exports.getOwnerUsageLogs = void 0;
const UsageLog_1 = require("../models/UsageLog");
const Equipment_1 = require("../models/Equipment");
const getOwnerUsageLogs = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const logs = await UsageLog_1.UsageLog.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });
        res.json(logs.map(l => l.toJSON()));
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch usage logs.' });
    }
};
exports.getOwnerUsageLogs = getOwnerUsageLogs;
const createUsageLog = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { equipmentId, date, hoursUsed, fuelConsumedLiters, acresCovered, operatorName, notes } = req.body;
        if (!equipmentId || !hoursUsed) {
            res.status(400).json({ message: 'Equipment ID and engine runtime hours are required.' });
            return;
        }
        const equipment = await Equipment_1.Equipment.findById(equipmentId);
        if (!equipment) {
            res.status(404).json({ message: 'Equipment not found' });
            return;
        }
        const log = await UsageLog_1.UsageLog.create({
            equipmentId: equipment._id,
            equipmentName: equipment.name,
            ownerId: req.user.userId,
            date: date || new Date().toISOString().split('T')[0],
            hoursUsed: Number(hoursUsed),
            fuelConsumedLiters: Number(fuelConsumedLiters || 0),
            acresCovered: Number(acresCovered || 0),
            operatorName: operatorName || '',
            notes: notes || ''
        });
        res.status(201).json(log.toJSON());
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to log equipment usage.' });
    }
};
exports.createUsageLog = createUsageLog;
