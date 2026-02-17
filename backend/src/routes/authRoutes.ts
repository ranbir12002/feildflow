import { Router } from 'express';
import { signup, signin } from '../controllers/authController';

const router = Router();

router.post('/register', signup);
router.post('/login', signin);

export default router;
