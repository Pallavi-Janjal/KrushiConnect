"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPaymentReceived = exports.processPayment = exports.verifyOtpAndComplete = exports.requestCompletionOtp = exports.updateBookingStatus = exports.getBookingById = exports.getOwnerBookings = exports.getFarmerBookings = exports.createBooking = void 0;
const Booking_1 = require("../models/Booking");
const Equipment_1 = require("../models/Equipment");
const User_1 = require("../models/User");
const Notification_1 = require("../models/Notification");
const Receipt_1 = require("../models/Receipt");
const createBooking = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { equipmentId, startDate, endDate, withOperator, location, purpose, farmerName: customName, farmerPhone: customPhone } = req.body;
        if (!equipmentId || !startDate || !endDate) {
            res.status(400).json({ message: 'Equipment ID, start date, and end date are required.' });
            return;
        }
        const equipment = await Equipment_1.Equipment.findById(equipmentId);
        if (!equipment) {
            res.status(404).json({ message: 'Equipment not found' });
            return;
        }
        if (!equipment.isAvailable) {
            res.status(400).json({ message: 'Equipment is currently not available for booking' });
            return;
        }
        const farmer = await User_1.User.findById(req.user.userId);
        if (!farmer) {
            res.status(404).json({ message: 'Farmer account not found' });
            return;
        }
        const owner = await User_1.User.findById(equipment.ownerId);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.max(end.getTime() - start.getTime(), 0);
        const totalDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1, 1);
        const dailyRate = equipment.pricePerDay;
        const operatorFee = withOperator ? (equipment.operatorCostPerDay || 500) * totalDays : 0;
        const equipmentTotal = dailyRate * totalDays;
        const subtotal = equipmentTotal + operatorFee;
        const platformFee = Math.round(subtotal * 0.03);
        const totalAmount = subtotal + platformFee;
        const newBooking = await Booking_1.Booking.create({
            equipmentId: equipment._id,
            equipmentName: equipment.name,
            equipmentImage: equipment.images[0] || '',
            category: equipment.category,
            farmerId: farmer._id,
            farmerName: customName || farmer.name,
            farmerPhone: customPhone || farmer.phone,
            ownerId: equipment.ownerId,
            ownerName: equipment.ownerName,
            startDate,
            endDate,
            totalDays,
            withOperator: Boolean(withOperator),
            dailyRate,
            operatorFee,
            platformFee,
            totalAmount,
            location: location || farmer.location || equipment.location,
            purpose: purpose || 'Agricultural Operation',
            status: 'PENDING',
            workCompleted: false,
            otpRequested: false,
            paymentStatus: 'PENDING',
            completionOtp: '',
            bankDetails: {
                bankName: 'HDFC Bank',
                accountNumber: '50100' + Math.floor(10000000 + Math.random() * 90000000),
                ifscCode: 'HDFC0001829',
                upiId: `${owner?.phone ? owner.phone.replace(/[^0-9]/g, '') : '9812345678'}@upi`
            }
        });
        // Notify Equipment Owner
        await Notification_1.Notification.create({
            userId: equipment.ownerId,
            title: 'New Equipment Rental Request',
            message: `${farmer.name} requested to rent your ${equipment.name} for ${totalDays} days (${startDate} to ${endDate}). Please ACCEPT or REJECT.`,
            type: 'BOOKING',
            link: '/owner/dashboard'
        });
        // Notify Farmer
        await Notification_1.Notification.create({
            userId: farmer._id,
            title: 'Rental Request Sent',
            message: `Your booking request for ${equipment.name} from ${startDate} to ${endDate} was submitted to ${equipment.ownerName}. Status: PENDING owner approval.`,
            type: 'BOOKING',
            link: '/farmer/rentals'
        });
        res.status(201).json(newBooking.toJSON());
    }
    catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: error.message || 'Failed to submit rental request' });
    }
};
exports.createBooking = createBooking;
const getFarmerBookings = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const list = await Booking_1.Booking.find({ farmerId: req.user.userId }).sort({ createdAt: -1 });
        res.json(list.map(b => b.toJSON()));
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch farmer bookings.' });
    }
};
exports.getFarmerBookings = getFarmerBookings;
const getOwnerBookings = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const list = await Booking_1.Booking.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });
        res.json(list.map(b => b.toJSON()));
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch owner bookings.' });
    }
};
exports.getOwnerBookings = getOwnerBookings;
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking_1.Booking.findById(req.params.id);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        res.json(booking.toJSON());
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch booking.' });
    }
};
exports.getBookingById = getBookingById;
const updateBookingStatus = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { status } = req.body;
        const booking = await Booking_1.Booking.findById(req.params.id);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        booking.status = status;
        await booking.save();
        let notifTitle = `Booking Status Updated: ${status}`;
        let notifMsg = `Your booking for ${booking.equipmentName} status is now ${status}.`;
        if (status === 'APPROVED') {
            notifTitle = '🎉 Booking Request ACCEPTED!';
            notifMsg = `Great news! ${booking.ownerName} ACCEPTED your booking request for ${booking.equipmentName} (${booking.startDate} to ${booking.endDate}).`;
        }
        else if (status === 'REJECTED') {
            notifTitle = 'Booking Request REJECTED';
            notifMsg = `Owner ${booking.ownerName} declined the booking request for ${booking.equipmentName}.`;
        }
        // Create Notification for Farmer
        await Notification_1.Notification.create({
            userId: booking.farmerId,
            title: notifTitle,
            message: notifMsg,
            type: 'BOOKING',
            link: '/farmer/rentals'
        });
        res.json(booking.toJSON());
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to update booking status.' });
    }
};
exports.updateBookingStatus = updateBookingStatus;
const requestCompletionOtp = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const booking = await Booking_1.Booking.findById(req.params.id);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        // Check that requester is the owner of this equipment/booking
        if (booking.ownerId.toString() !== req.user.userId) {
            res.status(403).json({ message: 'Only the equipment owner can request work completion OTP' });
            return;
        }
        // Generate random 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        booking.completionOtp = otp;
        booking.otpRequested = true;
        await booking.save();
        // Send notification with OTP to the farmer
        await Notification_1.Notification.create({
            userId: booking.farmerId,
            title: '🔑 Work Completion Verification OTP',
            message: `Owner ${booking.ownerName} has finished the job for ${booking.equipmentName}. Your 4-digit verification OTP is: ${otp}. Please verify the work in your field and share this OTP with the owner.`,
            type: 'BOOKING',
            link: '/farmer/rentals'
        });
        res.json(booking.toJSON());
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to request completion OTP.' });
    }
};
exports.requestCompletionOtp = requestCompletionOtp;
const verifyOtpAndComplete = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { otp } = req.body;
        const booking = await Booking_1.Booking.findById(req.params.id);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        if (!booking.completionOtp) {
            res.status(400).json({ message: 'OTP has not been requested yet. Please click Request Work Completion OTP first.' });
            return;
        }
        if (booking.completionOtp !== String(otp).trim()) {
            res.status(400).json({ message: 'Invalid 4-digit OTP provided. Please ask farmer for the correct OTP.' });
            return;
        }
        // Mark work as completed
        booking.workCompleted = true;
        booking.status = 'WORK_COMPLETED';
        await booking.save();
        // Notify farmer that work is verified and payment is now unlocked
        await Notification_1.Notification.create({
            userId: booking.farmerId,
            title: '✅ Work Verified! Payment Activated',
            message: `Work for ${booking.equipmentName} has been verified via OTP submission! You can now proceed to pay online or offline cash.`,
            type: 'BOOKING',
            link: '/farmer/rentals'
        });
        // Notify owner
        await Notification_1.Notification.create({
            userId: booking.ownerId,
            title: 'Work Verified via OTP',
            message: `Work for ${booking.equipmentName} is verified done! Farmer payment option has been activated.`,
            type: 'BOOKING',
            link: '/owner/dashboard'
        });
        res.json(booking.toJSON());
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to verify OTP.' });
    }
};
exports.verifyOtpAndComplete = verifyOtpAndComplete;
const processPayment = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { paymentMethod, transactionRef } = req.body;
        const booking = await Booking_1.Booking.findById(req.params.id);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        // Ensure payment only works when work completion is verified by OTP submission
        if (!booking.workCompleted) {
            res.status(400).json({ message: 'Payment option is locked! Work completion must be verified by OTP submission first.' });
            return;
        }
        booking.paymentMethod = paymentMethod || 'ONLINE';
        booking.transactionRef = transactionRef || (paymentMethod === 'CASH' ? `CASH-${Date.now()}` : `PAY-${Date.now()}`);
        if (paymentMethod === 'ONLINE') {
            booking.paymentStatus = 'PAID';
            booking.status = 'COMPLETED';
        }
        else {
            // Offline cash payment: marked as cash, owner confirms receipt
            booking.paymentStatus = 'PENDING';
        }
        await booking.save();
        // For ONLINE payments, also generate a receipt immediately
        if (paymentMethod === 'ONLINE') {
            const existingReceipt = await Receipt_1.Receipt.findOne({ bookingId: booking._id });
            if (!existingReceipt) {
                const subtotal = booking.totalAmount - booking.platformFee;
                const tax = Math.round(subtotal * 0.05);
                const grandTotalReceipt = subtotal + booking.platformFee + tax;
                await Receipt_1.Receipt.create({
                    bookingId: booking._id,
                    farmerId: booking.farmerId,
                    ownerId: booking.ownerId,
                    farmerName: booking.farmerName,
                    ownerName: booking.ownerName,
                    equipmentName: booking.equipmentName,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    subtotal,
                    platformFee: booking.platformFee,
                    tax,
                    total: grandTotalReceipt,
                    paymentMethod: 'Online Bank / UPI',
                    receiptNumber: `REC-${Date.now()}`
                });
            }
        }
        // Notify Farmer & Owner
        if (paymentMethod === 'ONLINE') {
            await Notification_1.Notification.create({
                userId: booking.farmerId,
                title: '🎉 Payment Successful & Rental Completed!',
                message: `Online payment of ₹${booking.totalAmount.toLocaleString('en-IN')} for ${booking.equipmentName} is confirmed. Your rental is now completed! Official receipt has been generated.`,
                type: 'BOOKING',
                link: '/farmer/receipts'
            });
            await Notification_1.Notification.create({
                userId: booking.ownerId,
                title: '🎉 Farmer Paid Online - Rental Completed!',
                message: `Farmer ${booking.farmerName} paid ₹${(booking.totalAmount - booking.platformFee).toLocaleString('en-IN')} online for ${booking.equipmentName}. Rental completed! Receipt generated.`,
                type: 'BOOKING',
                link: '/owner/receipts'
            });
        }
        else {
            await Notification_1.Notification.create({
                userId: booking.farmerId,
                title: 'Cash Payment Selected',
                message: `You selected Cash / Offline payment of ₹${booking.totalAmount.toLocaleString('en-IN')} for ${booking.equipmentName}. Please pay the owner directly upon handover.`,
                type: 'BOOKING',
                link: '/farmer/rentals'
            });
            await Notification_1.Notification.create({
                userId: booking.ownerId,
                title: 'Farmer Chose Cash Payment',
                message: `Farmer ${booking.farmerName} chose Cash payment of ₹${(booking.totalAmount - booking.platformFee).toLocaleString('en-IN')}. Please collect cash and click 'Confirm Payment Received'.`,
                type: 'BOOKING',
                link: '/owner/dashboard'
            });
        }
        res.json(booking.toJSON());
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to process payment.' });
    }
};
exports.processPayment = processPayment;
const confirmPaymentReceived = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const booking = await Booking_1.Booking.findById(req.params.id);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        // Verify requesting user is owner
        if (booking.ownerId.toString() !== req.user.userId) {
            res.status(403).json({ message: 'Only the equipment owner can confirm payment received.' });
            return;
        }
        booking.paymentStatus = 'PAID';
        booking.status = 'COMPLETED';
        if (!booking.paymentMethod) {
            booking.paymentMethod = 'CASH';
        }
        if (!booking.transactionRef) {
            booking.transactionRef = `CASH-${Date.now()}`;
        }
        await booking.save();
        // Create official receipt if not already created
        const existingReceipt = await Receipt_1.Receipt.findOne({ bookingId: booking._id });
        if (!existingReceipt) {
            const subtotal = booking.totalAmount - booking.platformFee;
            const tax = Math.round(subtotal * 0.05);
            const grandTotalReceipt = subtotal + booking.platformFee + tax;
            await Receipt_1.Receipt.create({
                bookingId: booking._id,
                farmerId: booking.farmerId,
                ownerId: booking.ownerId,
                farmerName: booking.farmerName,
                ownerName: booking.ownerName,
                equipmentName: booking.equipmentName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                subtotal,
                platformFee: booking.platformFee,
                tax,
                total: grandTotalReceipt,
                paymentMethod: booking.paymentMethod === 'CASH' ? 'Cash / Offline Handover' : 'Online Bank / UPI',
                receiptNumber: `REC-${Date.now()}`
            });
        }
        // Notify farmer
        await Notification_1.Notification.create({
            userId: booking.farmerId,
            title: '🎉 Payment Confirmed & Rental Completed!',
            message: `Owner ${booking.ownerName} has confirmed receiving payment for ${booking.equipmentName}. Your rental is now fully completed! Official receipt is generated.`,
            type: 'BOOKING',
            link: '/farmer/receipts'
        });
        res.json(booking.toJSON());
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to confirm payment receipt.' });
    }
};
exports.confirmPaymentReceived = confirmPaymentReceived;
