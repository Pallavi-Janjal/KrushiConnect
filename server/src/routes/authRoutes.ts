import { Router } from 'express';
import { register, login, getMe, logout, sendEmailOtp, verifyOtp } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendEmailOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', authenticate, getMe);
router.post('/logout', logout);

export default router;
