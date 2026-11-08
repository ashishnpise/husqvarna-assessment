import { WebhookDelivery } from '../../db/models/WebhookDelivery';

export class WebhookDeliveryResponseDto {
  public readonly id: string;
  public readonly flagKey: string;
  public readonly environment: string;
  public readonly action: string;
  public readonly payload: Record<string, unknown>;
  public readonly status: string;
  public readonly responseStatus: number | null;
  public readonly deliveredAt: string;

  constructor(delivery: WebhookDelivery) {
    this.id = delivery.id;
    this.flagKey = delivery.flagKey;
    this.environment = delivery.environment;
    this.action = delivery.action;
    this.payload = delivery.payload;
    this.status = delivery.status;
    this.responseStatus = delivery.responseStatus;
    this.deliveredAt =
      delivery.deliveredAt instanceof Date
        ? delivery.deliveredAt.toISOString()
        : String(delivery.deliveredAt);
  }

  static fromEntity(delivery: WebhookDelivery): WebhookDeliveryResponseDto {
    return new WebhookDeliveryResponseDto(delivery);
  }

  static fromEntities(deliveries: WebhookDelivery[]): WebhookDeliveryResponseDto[] {
    return deliveries.map((d) => WebhookDeliveryResponseDto.fromEntity(d));
  }
}

