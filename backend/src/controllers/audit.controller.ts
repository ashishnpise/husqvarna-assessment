import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/audit.service';
import { ApiResponse, AuditLogResponseDto } from '../dto';

export class AuditController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { flagKey, environment, limit } = req.query;
      const logs = await auditService.getRecentLogs({
        flagKey: typeof flagKey === 'string' ? flagKey : undefined,
        environment: typeof environment === 'string' ? environment : undefined,
        limit: limit ? parseInt(limit as string, 10) : 50,
      });

      const pojos = AuditLogResponseDto.fromEntities(logs);
      res.json(ApiResponse.success(pojos, 'Audit logs retrieved successfully', pojos.length));
    } catch (error) {
      next(error);
    }
  }
}

export const auditController = new AuditController();

