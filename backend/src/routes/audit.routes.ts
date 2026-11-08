import { Router } from 'express';
import { auditController } from '../controllers/audit.controller';

const router = Router();

router.get('/', (req, res, next) => auditController.list(req, res, next));

export const auditRoutes = router;

