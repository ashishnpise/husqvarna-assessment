import { Op, WhereOptions } from 'sequelize';
import { sequelize } from '../../db/connection';
import { FeatureFlag, AuditLog, Environment } from '../../db/models';
import { ConflictError, NotFoundError } from '../middleware/errorHandler';
import { webhookService } from './webhook.service';

export interface CreateFlagInput {
  key: string;
  description?: string;
  environment: Environment;
  enabled?: boolean;
}

export interface FlagFilterQuery {
  environment?: Environment;
  status?: 'enabled' | 'disabled';
  search?: string;
}

export class FlagService {
  async listFlags(query: FlagFilterQuery): Promise<FeatureFlag[]> {
    const where: Record<string | symbol, any> = {};

    if (query.environment) {
      where.environment = query.environment;
    }

    if (query.status) {
      where.enabled = query.status === 'enabled';
    }

    if (query.search && query.search.trim().length > 0) {
      const term = `%${query.search.trim()}%`;
      where[Op.or] = [
        { key: { [Op.iLike]: term } },
        { description: { [Op.iLike]: term } },
      ];
    }

    return FeatureFlag.findAll({
      where: where as WhereOptions,
      order: [
        ['environment', 'ASC'],
        ['key', 'ASC'],
      ],
    });
  }

  async getFlagById(id: string): Promise<FeatureFlag> {
    const flag = await FeatureFlag.findByPk(id);
    if (!flag) {
      throw new NotFoundError(`Feature flag with ID '${id}' not found`);
    }
    return flag;
  }

  async createFlag(input: CreateFlagInput, actor: string): Promise<FeatureFlag> {
    const existing = await FeatureFlag.findOne({
      where: {
        key: input.key,
        environment: input.environment,
      },
    });

    if (existing) {
      throw new ConflictError(
        `Feature flag with key '${input.key}' already exists in '${input.environment}' environment`
      );
    }

    // Atomic transaction: Flag creation + AuditLog entry
    return sequelize.transaction(async (t) => {
      const newFlag = await FeatureFlag.create(
        {
          key: input.key,
          description: input.description || null,
          environment: input.environment,
          enabled: input.enabled ?? false,
        },
        { transaction: t }
      );

      await AuditLog.create(
        {
          flagId: newFlag.id,
          flagKey: newFlag.key,
          environment: newFlag.environment,
          actor,
          action: 'CREATE',
          previousState: null,
          newState: {
            key: newFlag.key,
            environment: newFlag.environment,
            enabled: newFlag.enabled,
            description: newFlag.description,
          },
        },
        { transaction: t }
      );

      return newFlag;
    });
  }

  async toggleFlag(id: string, actor: string): Promise<FeatureFlag> {
    const { updatedFlag, previousStatus, newStatus } = await sequelize.transaction(
      async (t) => {
        const flag = await FeatureFlag.findByPk(id, {
          transaction: t,
          lock: true,
        });

        if (!flag) {
          throw new NotFoundError(`Feature flag with ID '${id}' not found`);
        }

        const previousStatus = flag.enabled;
        const newStatus = !previousStatus;

        await flag.update({ enabled: newStatus }, { transaction: t });

        await AuditLog.create(
          {
            flagId: flag.id,
            flagKey: flag.key,
            environment: flag.environment,
            actor,
            action: newStatus ? 'TOGGLE_ON' : 'TOGGLE_OFF',
            previousState: { enabled: previousStatus },
            newState: { enabled: newStatus },
          },
          { transaction: t }
        );

        return { updatedFlag: flag, previousStatus, newStatus };
      }
    );

    // Non-blocking asynchronous webhook notification on prod toggle
    if (updatedFlag.environment === 'prod') {
      webhookService.dispatchProdToggleNotification({
        event: 'flag.toggled',
        flagKey: updatedFlag.key,
        environment: updatedFlag.environment,
        actor,
        action: newStatus ? 'TOGGLE_ON' : 'TOGGLE_OFF',
        previousState: { enabled: previousStatus },
        newState: { enabled: newStatus },
        timestamp: new Date().toISOString(),
      });
    }

    return updatedFlag;
  }
}

export const flagService = new FlagService();

