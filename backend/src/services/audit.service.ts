import { WhereOptions } from 'sequelize';
import { AuditLog } from '../../db/models/AuditLog';

export interface AuditLogFilter {
  flagKey?: string;
  environment?: string;
  limit?: number;
}

export class AuditService {
  async getRecentLogs(filter: AuditLogFilter = {}): Promise<AuditLog[]> {
    const where: WhereOptions = {};

    if (filter.flagKey) {
      where.flagKey = filter.flagKey;
    }

    if (filter.environment) {
      where.environment = filter.environment;
    }

    const limit = Math.min(filter.limit || 50, 100);

    return AuditLog.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit,
    });
  }
}

export const auditService = new AuditService();

