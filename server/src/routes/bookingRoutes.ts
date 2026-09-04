import { Router } from 'express';
import {
  createBooking,
  getFarmerBookings,
  getOwnerBookings,
  getBookingById,
  updateBookingStatus,
  requestCompletionOtp,
  verifyOtpAndComplete,
  processPayment,
  confirmPaymentReceived
} from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createBooking);
router.get('/my', authenticate, getFarmerBookings);
router.get('/owner', authenticate, getOwnerBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id/status', authenticate, updateBookingStatus);
router.post('/:id/request-otp', authenticate, requestCompletionOtp);
router.post('/:id/verify-otp', authenticate, verifyOtpAndComplete);
router.post('/:id/pay', authenticate, processPayment);
router.post('/:id/confirm-payment', authenticate, confirmPaymentReceived);

export default router;

