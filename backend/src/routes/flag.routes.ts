import { Router } from 'express';
import { flagController } from '../controllers/flag.controller';

const router = Router();

router.get('/', (req, res, next) => flagController.list(req, res, next));
router.get('/:id', (req, res, next) => flagController.getById(req, res, next));
router.post('/', (req, res, next) => flagController.create(req, res, next));
router.patch('/:id/toggle', (req, res, next) => flagController.toggle(req, res, next));

export const flagRoutes = router;

