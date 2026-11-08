import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller';

const router = Router();

router.post('/webhook', (req, res) => webhookController.handleIncomingWebhook(req, res));
router.get('/webhook/recent', (req, res, next) =>
  webhookController.listRecentDeliveries(req, res, next)
);

export const webhookRoutes = router;

