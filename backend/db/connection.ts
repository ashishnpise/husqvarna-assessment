import { Sequelize } from 'sequelize';
import { config } from '../config/env';

export const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: config.nodeEnv === 'development' ? (msg) => console.log(`[SQL] ${msg}`) : false,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✓ PostgreSQL connected successfully via Sequelize');
  } catch (error) {
    console.error('✗ Database connection error:', error);
    throw error;
  }
};

