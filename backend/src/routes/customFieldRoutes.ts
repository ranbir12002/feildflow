import { Router } from 'express';
import { getCustomFields, createCustomField, deleteCustomField } from '../controllers/customFieldController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getCustomFields as any);
router.post('/', createCustomField as any);
router.delete('/:id', deleteCustomField as any);

export default router;
