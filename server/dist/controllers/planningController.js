"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFarmPlan = exports.createFarmPlan = exports.getFarmerPlans = void 0;
const FarmPlan_1 = require("../models/FarmPlan");
const getFarmerPlans = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const plans = await FarmPlan_1.FarmPlan.find({ farmerId: req.user.userId }).sort({ createdAt: -1 });
        res.json(plans.map(p => p.toJSON()));
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch farm plans.' });
    }
};
exports.getFarmerPlans = getFarmerPlans;
const createFarmPlan = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { cropName, landAreaAcres, activity, requiredEquipmentCategory, plannedStartDate, plannedEndDate, notes } = req.body;
        if (!cropName || !activity) {
            res.status(400).json({ message: 'Crop name and activity are required.' });
            return;
        }
        const plan = await FarmPlan_1.FarmPlan.create({
            farmerId: req.user.userId,
            cropName: cropName.trim(),
            landAreaAcres: Number(landAreaAcres || 5),
            activity: activity.trim(),
            requiredEquipmentCategory: requiredEquipmentCategory || 'Tractor',
            plannedStartDate: plannedStartDate || new Date().toISOString().split('T')[0],
            plannedEndDate: plannedEndDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'PLANNED',
            notes: notes || ''
        });
        res.status(201).json(plan.toJSON());
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to create farm plan.' });
    }
};
exports.createFarmPlan = createFarmPlan;
const deleteFarmPlan = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const plan = await FarmPlan_1.FarmPlan.findById(req.params.id);
        if (!plan) {
            res.status(404).json({ message: 'Plan not found' });
            return;
        }
        if (plan.farmerId.toString() !== req.user.userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        await FarmPlan_1.FarmPlan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Farm plan deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to delete farm plan.' });
    }
};
exports.deleteFarmPlan = deleteFarmPlan;
