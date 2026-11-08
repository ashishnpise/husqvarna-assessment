import { Request, Response, NextFunction } from 'express';
import { flagService } from '../services/flag.service';
import { createFlagSchema, filterFlagsSchema } from '../validations/flag.validation';
import { ApiResponse, FlagResponseDto } from '../dto';

export class FlagController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedQuery = filterFlagsSchema.parse(req.query);
      const flags = await flagService.listFlags(validatedQuery);
      const pojos = FlagResponseDto.fromEntities(flags);
      res.json(ApiResponse.success(pojos, 'Feature flags fetched successfully', pojos.length));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const flag = await flagService.getFlagById(req.params.id);
      const pojo = FlagResponseDto.fromEntity(flag);
      res.json(ApiResponse.success(pojo));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedInput = createFlagSchema.parse(req.body);
      const flag = await flagService.createFlag(validatedInput, req.actor);
      const pojo = FlagResponseDto.fromEntity(flag);
      res.status(201).json(ApiResponse.success(pojo, 'Feature flag created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async toggle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const flag = await flagService.toggleFlag(req.params.id, req.actor);
      const pojo = FlagResponseDto.fromEntity(flag);
      res.json(
        ApiResponse.success(
          pojo,
          `Feature flag '${pojo.key}' toggled ${pojo.enabled ? 'ON' : 'OFF'}`
        )
      );
    } catch (error) {
      next(error);
    }
  }
}

export const flagController = new FlagController();

