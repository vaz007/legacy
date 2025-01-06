require('dotenv').config(); // Load environment variables from .env

const { Sequelize } = require('sequelize');

if (
  !process.env.DB_NAME ||
  !process.env.DB_USERNAME ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_HOST ||
  !process.env.DB_DIALECT
) {
  throw new Error(
    'Missing required environment variables for database connection.',
  );
}

// Create a new instance of Sequelize using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USERNAME, // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host
    dialect: process.env.DB_DIALECT, // Database dialect (e.g., postgres)
    logging: process.env.DB_LOGGING === 'true' ? console.log : false, // Conditionally enable logging
  },
);

const db = {
  sequelize,
  Sequelize,
};

module.exports = db;
