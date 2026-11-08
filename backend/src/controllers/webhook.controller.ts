import { Request, Response, NextFunction } from 'express';
import { webhookService } from '../services/webhook.service';
import { ApiResponse, WebhookDeliveryResponseDto } from '../dto';

export class WebhookController {
  async handleIncomingWebhook(req: Request, res: Response): Promise<void> {
    const payload = req.body;
    console.log('[MockWebhookReceiver] Incoming external notification received:', {
      event: payload.event,
      flagKey: payload.flagKey,
      environment: payload.environment,
      action: payload.action,
      actor: payload.actor,
      timestamp: payload.timestamp,
    });

    res.status(200).json(
      ApiResponse.success(
        {
          received: true,
          service: 'MockExternalWebhookReceiver',
          timestamp: new Date().toISOString(),
        },
        'External webhook received successfully'
      )
    );
  }

  async listRecentDeliveries(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deliveries = await webhookService.getRecentDeliveries();
      const pojos = WebhookDeliveryResponseDto.fromEntities(deliveries);
      res.json(
        ApiResponse.success(
          pojos,
          'Webhook deliveries retrieved successfully',
          pojos.length
        )
      );
    } catch (error) {
      next(error);
    }
  }
}

export const webhookController = new WebhookController();

