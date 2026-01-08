const { Sequelize } = require('sequelize');

const sequelize = process.env.MYSQL_URL 
  ? new Sequelize(process.env.MYSQL_URL, {
      dialect: 'mysql',
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME || 'job_scheduler_db',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
      }
    );

module.exports = sequelize;