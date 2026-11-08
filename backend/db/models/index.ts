import { FeatureFlag } from './FeatureFlag';
import { AuditLog } from './AuditLog';
import { WebhookDelivery } from './WebhookDelivery';

// Model associations
FeatureFlag.hasMany(AuditLog, {
  foreignKey: 'flag_id',
  as: 'auditLogs',
  onDelete: 'SET NULL',
});

AuditLog.belongsTo(FeatureFlag, {
  foreignKey: 'flag_id',
  as: 'flag',
});

export { FeatureFlag, AuditLog, WebhookDelivery };
export type { Environment } from './FeatureFlag';

