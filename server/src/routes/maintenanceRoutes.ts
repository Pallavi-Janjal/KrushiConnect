import { Router } from 'express';
import {
  getOwnerMaintenanceRecords,
  createMaintenanceRecord,
  updateMaintenanceRecordStatus
} from '../controllers/maintenanceController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireRole(['EQUIPMENT_OWNER', 'equipment_owner']), getOwnerMaintenanceRecords);
router.post('/', authenticate, requireRole(['EQUIPMENT_OWNER', 'equipment_owner']), createMaintenanceRecord);
router.patch('/:id/status', authenticate, requireRole(['EQUIPMENT_OWNER', 'equipment_owner']), updateMaintenanceRecordStatus);

export default router;
