import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Booking } from '../models/Booking';
import { Equipment } from '../models/Equipment';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { bookingId, equipmentId, rating, comment } = req.body;

    if (!equipmentId || !rating || !comment) {
      res.status(400).json({ message: 'Equipment ID, rating, and comment are required.' });
      return;
    }

    // Prevent equipment owner from reviewing their own equipment
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      res.status(404).json({ message: 'Equipment not found.' });
      return;
    }
    if (equipment.ownerId.toString() === req.user.userId) {
      res.status(403).json({ message: 'You cannot review your own equipment.' });
      return;
    }

    // Check if user already reviewed this equipment (one review per user per equipment)
    const existingReview = await Review.findOne({ equipmentId, farmerId: req.user.userId });
    if (existingReview) {
      res.status(400).json({ message: 'You have already reviewed this equipment.' });
      return;
    }

    const farmer = await User.findById(req.user.userId);

    const newReview = await Review.create({
      bookingId,
      equipmentId,
      farmerId: req.user.userId,
      farmerName: farmer ? farmer.name : 'Farmer',
      rating: Number(rating),
      comment: comment.trim()
    });

    // Recalculate average rating & count for equipment
    const allReviews = await Review.find({ equipmentId });
    const count = allReviews.length;
    const avg = count > 0 ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)) : 0;

    await Equipment.findByIdAndUpdate(equipmentId, {
      rating: avg,
      reviewCount: count
    });

    res.status(201).json(newReview.toJSON());
  } catch (error: any) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: error.message || 'Failed to submit review' });
  }
};

export const getEquipmentReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ equipmentId: req.params.equipmentId }).sort({ createdAt: -1 });
    res.json(reviews.map(r => r.toJSON()));
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch reviews.' });
  }
};
