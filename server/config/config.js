const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    dialect: process.env.DATABASE_DIALECT || 'postgres',
    use_env_variable: 'DATABASE_URL',
  },
  test: {
    dialect: process.env.DATABASE_DIALECT || 'postgres',
    use_env_variable: 'DATABASE_URL_TEST',
  },
  production: {
    dialect: process.env.DATABASE_DIALECT || 'postgres',
    use_env_variable: 'DATABASE_URL_PRDTN',
  },
};
