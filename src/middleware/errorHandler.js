const logger = require('../utils/logger');

// src/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  if (!err) {
    return res.status(500).json({
      success: false,
      message: 'Unknown error',
    });
  }

  // Log the error (ensure logger is correctly set up)
  console.error(err); // This logs the error details to the console
  logger.error('Error:', err.message);

  // Send a response to the client
  return res.status(err.status || 400).json({
    success: false,
    message: err.message || 'Bad Request',
  });
};
