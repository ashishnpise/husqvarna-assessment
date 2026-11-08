import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

export interface WebhookDeliveryAttributes {
  id: string;
  flagKey: string;
  environment: string;
  action: string;
  payload: Record<string, unknown>;
  status: 'DELIVERED' | 'FAILED';
  responseStatus: number | null;
  deliveredAt?: Date;
}

export type WebhookDeliveryCreationAttributes = Optional<
  WebhookDeliveryAttributes,
  'id' | 'responseStatus' | 'deliveredAt'
>;

export class WebhookDelivery
  extends Model<WebhookDeliveryAttributes, WebhookDeliveryCreationAttributes>
  implements WebhookDeliveryAttributes
{
  declare id: string;
  declare flagKey: string;
  declare environment: string;
  declare action: string;
  declare payload: Record<string, unknown>;
  declare status: 'DELIVERED' | 'FAILED';
  declare responseStatus: number | null;
  declare readonly deliveredAt: Date;
}

WebhookDelivery.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    flagKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'flag_key',
    },
    environment: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    responseStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'response_status',
    },
    deliveredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: 'delivered_at',
    },
  },
  {
    sequelize,
    tableName: 'webhook_deliveries',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: [{ name: 'delivered_at', order: 'DESC' }],
        name: 'idx_webhook_deliveries_delivered_at',
      },
    ],
  }
);

