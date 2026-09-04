"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getUserNotifications = void 0;
const Notification_1 = require("../models/Notification");
const getUserNotifications = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const list = await Notification_1.Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(list.map(n => n.toJSON()));
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch notifications.' });
    }
};
exports.getUserNotifications = getUserNotifications;
const markAsRead = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const item = await Notification_1.Notification.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to update notification.' });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await Notification_1.Notification.updateMany({ userId: req.user.userId, isRead: false }, { isRead: true });
        res.json({ message: 'All notifications marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to update notifications.' });
    }
};
exports.markAllAsRead = markAllAsRead;
