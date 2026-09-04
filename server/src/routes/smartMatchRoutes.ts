import { Router } from 'express';
import { getSmartMatches } from '../controllers/smartMatchController';

const router = Router();

router.post('/', getSmartMatches);

export default router;
