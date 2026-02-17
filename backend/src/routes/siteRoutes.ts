import { Router } from 'express';
import { getSites, createSite, getAllSites } from '../controllers/siteController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router({ mergeParams: true }); // mergeParams to access companyId from parent route

router.use(authenticateJWT);

router.get('/', (req, res) => {
    const params = req.params as any;
    if (params.companyId) {
        return getSites(req as any, res);
    }
    return getAllSites(req as any, res);
});
router.post('/', createSite as any);

export default router;
