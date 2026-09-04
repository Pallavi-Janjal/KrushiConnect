import { Router } from 'express';
import { getFarmerPlans, createFarmPlan, deleteFarmPlan, updateFarmPlanStatus } from '../controllers/planningController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getFarmerPlans);
router.post('/', authenticate, createFarmPlan);
router.delete('/:id', authenticate, deleteFarmPlan);
router.patch('/:id/status', authenticate, updateFarmPlanStatus);

export default router;
