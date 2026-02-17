import { Router } from 'express';
import { getRoles, createRole } from '../controllers/roleController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getRoles as any);
router.post('/', createRole as any);

export default router;
