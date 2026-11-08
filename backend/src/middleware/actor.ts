import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      actor: string;
    }
  }
}

export const extractActor = (req: Request, _res: Response, next: NextFunction): void => {
  const headerActor = req.headers['x-actor'];
  if (typeof headerActor === 'string' && headerActor.trim().length > 0) {
    req.actor = headerActor.trim();
  } else {
    req.actor = 'admin@husqvarna.com';
  }
  next();
};

