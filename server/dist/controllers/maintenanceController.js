"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMaintenanceRecordStatus = exports.createMaintenanceRecord = exports.getOwnerMaintenanceRecords = void 0;
const MaintenanceRecord_1 = require("../models/MaintenanceRecord");
const Equipment_1 = require("../models/Equipment");
const getOwnerMaintenanceRecords = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const records = await MaintenanceRecord_1.MaintenanceRecord.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });
        res.json(records.map(r => r.toJSON()));
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch maintenance records.' });
    }
};
exports.getOwnerMaintenanceRecords = getOwnerMaintenanceRecords;
const createMaintenanceRecord = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { equipmentId, equipmentName, healthStatus, lastServiceDate, nextServiceDueDate, serviceType, cost, notes, status } = req.body;
        if (!equipmentId || !serviceType) {
            res.status(400).json({ message: 'Equipment ID and service type are required.' });
            return;
        }
        const equipment = await Equipment_1.Equipment.findById(equipmentId);
        if (!equipment) {
            res.status(404).json({ message: 'Equipment not found' });
            return;
        }
        const record = await MaintenanceRecord_1.MaintenanceRecord.create({
            equipmentId: equipment._id,
            equipmentName: equipmentName || equipment.name,
            ownerId: req.user.userId,
            healthStatus: healthStatus || 'Healthy',
            lastServiceDate: lastServiceDate || new Date().toISOString().split('T')[0],
            nextServiceDueDate: nextServiceDueDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            serviceType: serviceType.trim(),
            cost: Number(cost || 0),
            notes: notes || '',
            status: status || 'Scheduled'
        });
        res.status(201).json(record.toJSON());
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to log maintenance record.' });
    }
};
exports.createMaintenanceRecord = createMaintenanceRecord;
const updateMaintenanceRecordStatus = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { status, healthStatus } = req.body;
        const record = await MaintenanceRecord_1.MaintenanceRecord.findById(req.params.id);
        if (!record) {
            res.status(404).json({ message: 'Maintenance record not found' });
            return;
        }
        if (record.ownerId.toString() !== req.user.userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        if (status)
            record.status = status;
        if (healthStatus)
            record.healthStatus = healthStatus;
        await record.save();
        res.json(record.toJSON());
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to update maintenance record.' });
    }
};
exports.updateMaintenanceRecordStatus = updateMaintenanceRecordStatus;
