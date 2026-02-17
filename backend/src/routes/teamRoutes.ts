import { Router } from 'express';
import { getTeams, createTeam } from '../controllers/teamController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getTeams as any);
router.post('/', createTeam as any);

export default router;
