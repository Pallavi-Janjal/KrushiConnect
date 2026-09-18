import { Router } from 'express';
import {
  getAllEquipment,
  getEquipmentById,
  getOwnerEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  toggleAvailability
} from '../controllers/equipmentController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getAllEquipment);
router.get('/owner/:ownerId', getOwnerEquipment); // Must be before /:id to avoid shadowing
router.get('/:id', getEquipmentById);

router.post('/', authenticate, requireRole(['EQUIPMENT_OWNER', 'equipment_owner']), createEquipment);
router.put('/:id', authenticate, requireRole(['EQUIPMENT_OWNER', 'equipment_owner']), updateEquipment);
router.delete('/:id', authenticate, requireRole(['EQUIPMENT_OWNER', 'equipment_owner']), deleteEquipment);
router.patch('/:id/toggle-availability', authenticate, requireRole(['EQUIPMENT_OWNER', 'equipment_owner']), toggleAvailability);

export default router;
