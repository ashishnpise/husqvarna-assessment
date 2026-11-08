import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { UniqueConstraintError, ValidationError as SequelizeValidationError } from 'sequelize';
import { ApiResponse } from '../dto/api-response.dto';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400, 'BAD_REQUEST');
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
          res.status(400).json(
            ApiResponse.error(
              'VALIDATION_ERROR',
              'Invalid request payload',
              err.errors.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
  }))
      )
    );
return;
  }

if (err instanceof UniqueConstraintError) {
  res.status(409).json(
    ApiResponse.error(
      'DUPLICATE_RESOURCE',
      'A feature flag with this key already exists in this environment.'
    )
  );
  return;
}

if (err instanceof SequelizeValidationError) {
  res.status(400).json(
    ApiResponse.error('DB_VALIDATION_ERROR', err.message)
  );
  return;
}

if (err instanceof AppError) {
  res.status(err.statusCode).json(
    ApiResponse.error(err.code, err.message)
  );
  return;
}

console.error('Unhandled Server Error:', err);
res.status(500).json(
  ApiResponse.error(
    'INTERNAL_SERVER_ERROR',
    'An unexpected internal server error occurred.'
  )
);
};
