import { Response } from 'express';
import { Receipt } from '../models/Receipt';
import { AuthRequest } from '../middleware/auth';

export const getUserReceipts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user.userId;
    const receipts = await Receipt.find({
      $or: [{ farmerId: userId }, { ownerId: userId }]
    }).sort({ createdAt: -1 });

    res.json(receipts.map(r => r.toJSON()));
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch receipts.' });
  }
};
