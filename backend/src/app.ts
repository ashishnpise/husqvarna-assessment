import express from 'express';
import cors from 'cors';
import { config } from '../config/env';
import { extractActor } from './middleware/actor';
import { errorHandler } from './middleware/errorHandler';
import { apiRoutes } from './routes';
import { ApiResponse } from './dto';

export const createApp = (): express.Application => {
  const app = express();

  // Basic middleware
  app.use(
    cors({
      origin: [config.clientOrigin, 'http://localhost:3000'],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(extractActor);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json(
      ApiResponse.success(
        {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'husqvarna-flags-backend',
        },
        'Service is healthy'
      )
    );
  });

  // Mount layered API routes under /api
  app.use('/api', apiRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
