"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerAnalytics = void 0;
const Booking_1 = require("../models/Booking");
const Equipment_1 = require("../models/Equipment");
const getOwnerAnalytics = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const ownerId = req.user.userId;
        const ownerEquipment = await Equipment_1.Equipment.find({ ownerId });
        const equipmentCount = ownerEquipment.length;
        const ownerBookings = await Booking_1.Booking.find({ ownerId });
        const totalEarnings = ownerBookings.reduce((sum, b) => {
            if (b.status === 'COMPLETED' || b.status === 'ACTIVE' || b.status === 'APPROVED') {
                return sum + (b.totalAmount - b.platformFee);
            }
            return sum;
        }, 0);
        const activeBookingsCount = ownerBookings.filter(b => b.status === 'PENDING' || b.status === 'APPROVED' || b.status === 'ACTIVE').length;
        // Monthly earnings calculation
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyMap = {};
        months.forEach(m => { monthlyMap[m] = 0; });
        ownerBookings.forEach(b => {
            if (b.createdAt) {
                const d = new Date(b.createdAt);
                const monthName = months[d.getMonth()];
                if (monthName && (b.status === 'COMPLETED' || b.status === 'ACTIVE' || b.status === 'APPROVED')) {
                    monthlyMap[monthName] += (b.totalAmount - b.platformFee);
                }
            }
        });
        const monthlyRevenueData = months.map(month => ({
            month,
            earnings: monthlyMap[month] || 0
        }));
        // Equipment performance
        const equipmentPerformanceData = ownerEquipment.map(eq => {
            const eqBookings = ownerBookings.filter(b => b.equipmentId.toString() === eq._id.toString());
            const revenue = eqBookings.reduce((sum, b) => sum + (b.totalAmount - b.platformFee), 0);
            const daysRented = eqBookings.reduce((sum, b) => sum + b.totalDays, 0);
            return {
                name: eq.name,
                revenue,
                daysRented
            };
        });
        const utilizationRate = equipmentCount > 0 ? Math.min(Math.round((activeBookingsCount / equipmentCount) * 100), 100) : 0;
        res.json({
            totalEarnings,
            totalEquipmentCount: equipmentCount,
            activeBookingsCount,
            utilizationRate,
            monthlyRevenueData,
            equipmentPerformanceData
        });
    }
    catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch owner analytics.' });
    }
};
exports.getOwnerAnalytics = getOwnerAnalytics;
