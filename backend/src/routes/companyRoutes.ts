import { Router } from 'express';
import { getCompanies, createCompany } from '../controllers/companyController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getCompanies as any);
router.post('/', createCompany as any);

export default router;
