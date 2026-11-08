import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';
import { Environment } from './FeatureFlag';

export interface AuditLogAttributes {
  id: string;
  flagId: string | null;
  flagKey: string;
  environment: Environment;
  actor: string;
  action: string;
  previousState: Record<string, unknown> | null;
  newState: Record<string, unknown>;
  timestamp?: Date;
}

export type AuditLogCreationAttributes = Optional<AuditLogAttributes, 'id' | 'flagId' | 'previousState' | 'timestamp'>;

export class AuditLog
  extends Model<AuditLogAttributes, AuditLogCreationAttributes>
  implements AuditLogAttributes
{
  declare id: string;
  declare flagId: string | null;
  declare flagKey: string;
  declare environment: Environment;
  declare actor: string;
  declare action: string;
  declare previousState: Record<string, unknown> | null;
  declare newState: Record<string, unknown>;
  declare readonly timestamp: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    flagId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'flag_id',
    },
    flagKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'flag_key',
    },
    environment: {
      type: DataTypes.ENUM('dev', 'staging', 'prod'),
      allowNull: false,
    },
    actor: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    previousState: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'previous_state',
    },
    newState: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'new_state',
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: [{ name: 'timestamp', order: 'DESC' }],
        name: 'idx_audit_logs_timestamp',
      },
      {
        fields: ['flag_key'],
        name: 'idx_audit_logs_flag_key',
      },
    ],
  }
);

