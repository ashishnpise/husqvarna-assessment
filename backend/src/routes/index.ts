import { Router } from 'express';
import { flagRoutes } from './flag.routes';
import { auditRoutes } from './audit.routes';
import { webhookRoutes } from './webhook.routes';

const router = Router();

router.use('/flags', flagRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/mock', webhookRoutes);

export const apiRoutes = router;

