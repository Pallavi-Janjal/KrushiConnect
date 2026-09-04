import { Router } from 'express';
import { getMandiRates } from '../controllers/mandiController';

const router = Router();

router.get('/', getMandiRates);

export default router;
