const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./config/index');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config(); // Load environment variables from .env
// Routes
const healthcheckRoutes = require('./routes/healthcheck');
const nomineeRoutes = require('./routes/nomineeRoute');
const userRoutes = require('./routes/userRoute');

// Express App
const app = express();

// --- Middleware ---
app.use(cors()); // Handle Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON payloads
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); // Log incoming requests in Apache format
app.use(helmet());
// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// --- Database Connection ---
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Sync models with the database (you can use { force: true }
// in development to drop and recreate tables)
sequelize
  .sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch((error) => console.error('Error syncing database:', error));

// --- Routes ---
app.use('/api/v1/healthcheck', healthcheckRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/nominee', nomineeRoutes);

// --- Global Error Handler ---
app.use(errorHandler);

// --- Route Not Found Handler ---
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error); // Pass error to global error handler
});

module.exports = app;
