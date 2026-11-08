const path = require('path');

// Check config/.env, then backend/.env, then root .env
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const getDbUrl = () => {
  const url = process.env.DATABASE_URL || 'postgres://postgres:postgrespassword@localhost:5432/husqvarna_flags';
  if (process.env.NODE_ENV === 'test' && url.includes('@postgres:')) {
    return url.replace('@postgres:', '@localhost:');
  }
  return url;
};

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    url: process.env.DATABASE_URL || 'postgres://postgres:postgrespassword@localhost:5432/husqvarna_flags',
    dialect: 'postgres',
    logging: false
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    url: getDbUrl(),
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false
  }
};
