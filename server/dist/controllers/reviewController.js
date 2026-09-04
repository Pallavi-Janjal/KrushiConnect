"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEquipmentReviews = exports.createReview = void 0;
const Review_1 = require("../models/Review");
const Equipment_1 = require("../models/Equipment");
const User_1 = require("../models/User");
const createReview = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { bookingId, equipmentId, rating, comment } = req.body;
        if (!bookingId || !equipmentId || !rating || !comment) {
            res.status(400).json({ message: 'Booking ID, equipment ID, rating, and comment are required.' });
            return;
        }
        const existingReview = await Review_1.Review.findOne({ bookingId, farmerId: req.user.userId });
        if (existingReview) {
            res.status(400).json({ message: 'You have already submitted a review for this rental booking.' });
            return;
        }
        const farmer = await User_1.User.findById(req.user.userId);
        const newReview = await Review_1.Review.create({
            bookingId,
            equipmentId,
            farmerId: req.user.userId,
            farmerName: farmer ? farmer.name : 'Farmer',
            rating: Number(rating),
            comment: comment.trim()
        });
        // Recalculate average rating & count for equipment
        const allReviews = await Review_1.Review.find({ equipmentId });
        const count = allReviews.length;
        const avg = count > 0 ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)) : 0;
        await Equipment_1.Equipment.findByIdAndUpdate(equipmentId, {
            rating: avg,
            reviewCount: count
        });
        res.status(201).json(newReview.toJSON());
    }
    catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: error.message || 'Failed to submit review' });
    }
};
exports.createReview = createReview;
const getEquipmentReviews = async (req, res) => {
    try {
        const reviews = await Review_1.Review.find({ equipmentId: req.params.equipmentId }).sort({ createdAt: -1 });
        res.json(reviews.map(r => r.toJSON()));
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch reviews.' });
    }
};
exports.getEquipmentReviews = getEquipmentReviews;
