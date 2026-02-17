import express from 'express';
import multer from 'multer';
import { uploadFile, getPresignedUrl } from '../controllers/uploadController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// GET /api/upload/presigned-url - Requires authentication
router.post('/presigned-url', authenticateJWT, getPresignedUrl);

// POST /api/upload - Requires authentication
router.post('/', authenticateJWT, upload.single('file'), uploadFile);

export default router;
