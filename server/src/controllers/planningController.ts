import { Response } from 'express';
import { FarmPlan } from '../models/FarmPlan';
import { AuthRequest } from '../middleware/auth';

export const getFarmerPlans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const plans = await FarmPlan.find({ farmerId: req.user.userId }).sort({ createdAt: -1 });
    res.json(plans.map(p => p.toJSON()));
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch farm plans.' });
  }
};

export const createFarmPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const {
      cropName,
      landAreaAcres,
      activity,
      requiredEquipmentCategory,
      plannedStartDate,
      plannedEndDate,
      notes
    } = req.body;

    if (!cropName || !activity) {
      res.status(400).json({ message: 'Crop name and activity are required.' });
      return;
    }

    const plan = await FarmPlan.create({
      farmerId: req.user.userId,
      cropName: cropName.trim(),
      landAreaAcres: Number(landAreaAcres || 5),
      activity: activity.trim(),
      requiredEquipmentCategory: requiredEquipmentCategory || 'Tractor',
      plannedStartDate: plannedStartDate || new Date().toISOString().split('T')[0],
      plannedEndDate: plannedEndDate || new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0],
      status: 'PLANNED',
      notes: notes || ''
    });

    res.status(201).json(plan.toJSON());
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create farm plan.' });
  }
};

export const deleteFarmPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const plan = await FarmPlan.findById(req.params.id);
    if (!plan) {
      res.status(404).json({ message: 'Plan not found' });
      return;
    }

    if (plan.farmerId.toString() !== req.user.userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    await FarmPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Farm plan deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete farm plan.' });
  }
};
