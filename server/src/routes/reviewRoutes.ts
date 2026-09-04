import { Router } from 'express';
import { createReview, getEquipmentReviews } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createReview);
router.get('/equipment/:equipmentId', getEquipmentReviews);

export default router;
