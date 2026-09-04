import { Response } from 'express';
import { MaintenanceRecord } from '../models/MaintenanceRecord';
import { Equipment } from '../models/Equipment';
import { AuthRequest } from '../middleware/auth';

export const getOwnerMaintenanceRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const records = await MaintenanceRecord.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });
    res.json(records.map(r => r.toJSON()));
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch maintenance records.' });
  }
};

export const createMaintenanceRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const {
      equipmentId,
      equipmentName,
      healthStatus,
      lastServiceDate,
      nextServiceDueDate,
      serviceType,
      cost,
      notes,
      status
    } = req.body;

    if (!equipmentId || !serviceType) {
      res.status(400).json({ message: 'Equipment ID and service type are required.' });
      return;
    }

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      res.status(404).json({ message: 'Equipment not found' });
      return;
    }

    const record = await MaintenanceRecord.create({
      equipmentId: equipment._id,
      equipmentName: equipmentName || equipment.name,
      ownerId: req.user.userId,
      healthStatus: healthStatus || 'Healthy',
      lastServiceDate: lastServiceDate || new Date().toISOString().split('T')[0],
      nextServiceDueDate: nextServiceDueDate || new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0],
      serviceType: serviceType.trim(),
      cost: Number(cost || 0),
      notes: notes || '',
      status: status || 'Scheduled'
    });

    res.status(201).json(record.toJSON());
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to log maintenance record.' });
  }
};

export const updateMaintenanceRecordStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { status, healthStatus } = req.body;
    const record = await MaintenanceRecord.findById(req.params.id);
    if (!record) {
      res.status(404).json({ message: 'Maintenance record not found' });
      return;
    }

    if (record.ownerId.toString() !== req.user.userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    if (status) record.status = status;
    if (healthStatus) record.healthStatus = healthStatus;
    await record.save();

    res.json(record.toJSON());
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update maintenance record.' });
  }
};
