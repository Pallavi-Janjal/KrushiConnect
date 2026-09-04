import { Router } from 'express';
import { getOwnerAnalytics } from '../controllers/analyticsController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/owner', authenticate, requireRole(['EQUIPMENT_OWNER', 'equipment_owner']), getOwnerAnalytics);

export default router;
