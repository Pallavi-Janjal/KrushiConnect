import { Response } from 'express';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

export const getUserNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const list = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(list.map(n => n.toJSON()));
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch notifications.' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const item = await Notification.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    if (item.userId.toString() !== req.user.userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    item.isRead = true;
    await item.save();

    res.json(item.toJSON());
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update notification.' });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await Notification.updateMany({ userId: req.user.userId, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update notifications.' });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const item = await Notification.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    if (item.userId.toString() !== req.user.userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete notification.' });
  }
};

