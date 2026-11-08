import dotenv from 'dotenv';
import path from 'path';

// Check config/.env, then backend/.env, then root .env
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const resolveDatabaseUrl = (): string => {
  const url =
    process.env.DATABASE_URL ||
    'postgres://postgres:postgrespassword@localhost:5432/husqvarna_flags';
  if (process.env.NODE_ENV === 'test' && url.includes('@postgres:')) {
    return url.replace('@postgres:', '@localhost:');
  }
  return url;
};

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: resolveDatabaseUrl(),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  webhookTargetUrl:
    process.env.WEBHOOK_TARGET_URL || 'http://localhost:4000/api/mock/webhook',
};
