import axios from 'axios';
import { config } from '../../config/env';
import { WebhookDelivery } from '../../db/models/WebhookDelivery';

export interface WebhookPayload {
  event: 'flag.toggled';
  flagKey: string;
  environment: string;
  actor: string;
  action: string;
  previousState: Record<string, unknown>;
  newState: Record<string, unknown>;
  timestamp: string;
}

export class WebhookService {
  /**
   * Dispatches an asynchronous external notification for prod flag toggles.
   * Runs detached via setImmediate so the HTTP response returns immediately without blocking.
   */
  public dispatchProdToggleNotification(payload: WebhookPayload): void {
    setImmediate(async () => {
      console.log(`[WebhookService] Initiating async notification for prod flag: ${payload.flagKey}`);
      const startTime = Date.now();

      try {
        const response = await axios.post(config.webhookTargetUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Husqvarna-FeatureFlag-Notifier/1.0',
          },
          timeout: 4000,
        });

        const duration = Date.now() - startTime;
        console.log(
          `[WebhookService] Webhook delivered successfully for ${payload.flagKey} (${response.status}) in ${duration}ms`
        );

        await WebhookDelivery.create({
          flagKey: payload.flagKey,
          environment: payload.environment,
          action: payload.action,
          payload: payload as unknown as Record<string, unknown>,
          status: 'DELIVERED',
          responseStatus: response.status,
        });
      } catch (err: unknown) {
        const error = err as { response?: { status?: number }; message?: string };
        const status = error.response?.status || null;
        console.warn(
          `[WebhookService] Warning: Failed to deliver webhook for ${payload.flagKey}: ${error.message}`
        );

        await WebhookDelivery.create({
          flagKey: payload.flagKey,
          environment: payload.environment,
          action: payload.action,
          payload: payload as unknown as Record<string, unknown>,
          status: 'FAILED',
          responseStatus: status,
        }).catch((dbErr) => {
          console.error('[WebhookService] Failed to record delivery failure:', dbErr);
        });
      }
    });
  }

  public async getRecentDeliveries(): Promise<WebhookDelivery[]> {
    return WebhookDelivery.findAll({
      order: [['deliveredAt', 'DESC']],
      limit: 50,
    });
  }
}

export const webhookService = new WebhookService();

