import { Router } from 'express';
import { getUserReceipts } from '../controllers/receiptController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getUserReceipts);

export default router;
