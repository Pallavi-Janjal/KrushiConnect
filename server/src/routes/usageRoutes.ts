import { Router } from 'express';
import { getOwnerUsageLogs, createUsageLog } from '../controllers/usageController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireRole(['EQUIPMENT_OWNER', 'equipment_owner']), getOwnerUsageLogs);
router.post('/', authenticate, requireRole(['EQUIPMENT_OWNER', 'equipment_owner']), createUsageLog);

export default router;
