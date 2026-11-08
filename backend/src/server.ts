import { createApp } from './app';
import { config } from '../config/env';
import { connectDatabase } from '../db/connection';
import '../db/models';

const startServer = async (): Promise<void> => {
  try {
    console.log('🚀 Booting Husqvarna Feature Flag Backend Service...');

    // 1. Authenticate PostgreSQL Connection
    await connectDatabase();

    // 2. Start HTTP Server
    const app = createApp();
    app.listen(config.port, () => {
      console.log(`✓ Express server listening on port ${config.port} (${config.nodeEnv})`);
      console.log(`✓ Webhook mock receiver available at /api/mock/webhook`);
    });
  } catch (error) {
    console.error('✗ Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
