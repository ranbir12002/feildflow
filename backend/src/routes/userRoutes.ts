import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getUsers as any);
router.post('/', createUser as any);
router.put('/:id', updateUser as any);
router.delete('/:id', deleteUser as any);

export default router;
